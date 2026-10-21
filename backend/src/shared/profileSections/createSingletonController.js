/**
 * Controller for profile sections that hold one document per owner (a company or a freelancer).
 *  - ownerField: the model field holding the owner id ("company" or "freelancer"); it is also
 *    passed to hooks by name, e.g. { company } or { freelancer }.
 *  - resolvePublishedOwner(listingId): maps a public listing id to the owner id, or null.
 * Hooks:
 *  - beforeSave(values, ctx) may add derived fields.
 *  - afterSave(doc, ctx) may sync other collections (e.g. the public listing).
 */
export function createSingletonController({ Model, config, ownerField, resolvePublishedOwner, beforeSave, afterSave }) {
  const context = (ownerId) => ({ owner: ownerId, [ownerField]: ownerId });

  return {
    getMine: async (req, res, next) => {
      try {
        res.json({ data: await Model.findOne({ [ownerField]: req.auth.sub }) });
      } catch (error) { next(error); }
    },

    saveMine: async (req, res, next) => {
      try {
        const ownerId = req.auth.sub;
        const values = { ...req.validated };
        await beforeSave?.(values, context(ownerId));
        const doc = await Model.findOneAndUpdate(
          { [ownerField]: ownerId },
          { $set: values, $setOnInsert: { [ownerField]: ownerId } },
          { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
        );
        await afterSave?.(doc, context(ownerId));
        res.json({ message: `${config.label} saved.`, data: doc });
      } catch (error) { next(error); }
    },

    getPublic: async (req, res, next) => {
      try {
        const ownerId = await resolvePublishedOwner(req.params.listingId);
        if (!ownerId) return res.status(404).json({ message: "Listing not found." });
        res.json({ data: await Model.findOne({ [ownerField]: ownerId }).select(`-${ownerField} -__v`) });
      } catch (error) { next(error); }
    },
  };
}
