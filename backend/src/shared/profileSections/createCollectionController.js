/**
 * Controller for profile sections that hold a list of items per owner (a company or a freelancer).
 * Every query is scoped to the signed-in owner, so nobody can read or change another owner's items.
 *  - ownerField: the model field holding the owner id ("company" or "freelancer"); it is also
 *    passed to hooks by name, e.g. { company } or { freelancer }.
 *  - resolvePublishedOwner(listingId): maps a public listing id to the owner id, or null.
 * Hooks:
 *  - beforeWrite(values, ctx & { id }) may add derived fields (slug, media kind, ...).
 *  - afterChange(ctx) runs after create/update/delete (e.g. to sync the public listing).
 *  - publicFilter() returns extra conditions for the public endpoint (e.g. only published blogs).
 */
export function createCollectionController({ Model, config, ownerField, resolvePublishedOwner, beforeWrite, afterChange, publicFilter }) {
  const notFound = (res) => res.status(404).json({ message: `${config.label} not found.` });
  const sort = { position: 1, createdAt: 1 };
  const context = (ownerId) => ({ owner: ownerId, [ownerField]: ownerId });

  return {
    list: async (req, res, next) => {
      try {
        res.json({ data: await Model.find({ [ownerField]: req.auth.sub }).sort(sort) });
      } catch (error) { next(error); }
    },

    create: async (req, res, next) => {
      try {
        const ownerId = req.auth.sub;
        const count = await Model.countDocuments({ [ownerField]: ownerId });
        if (count >= config.maxItems) {
          return res.status(409).json({ message: `You can add up to ${config.maxItems} ${config.labelPlural}.` });
        }
        const values = { ...req.validated };
        await beforeWrite?.(values, context(ownerId));
        const doc = await Model.create({ ...values, [ownerField]: ownerId, position: count });
        await afterChange?.(context(ownerId));
        res.status(201).json({ message: `${config.label} added.`, data: doc });
      } catch (error) { next(error); }
    },

    getOne: async (req, res, next) => {
      try {
        const doc = await Model.findOne({ _id: req.params.id, [ownerField]: req.auth.sub });
        if (!doc) return notFound(res);
        res.json({ data: doc });
      } catch (error) { next(error); }
    },

    update: async (req, res, next) => {
      try {
        const ownerId = req.auth.sub;
        const scope = { _id: req.params.id, [ownerField]: ownerId };
        const values = { ...req.validated };
        if (config.validate) {
          // Cross-field rules (e.g. offer end date after start date) must hold for the merged record,
          // not just for the fields sent in this partial update.
          const existing = await Model.findOne(scope).lean();
          if (!existing) return notFound(res);
          const errors = config.validate({ ...existing, ...values }) ?? {};
          if (Object.keys(errors).length) return res.status(400).json({ message: `Please check the ${config.label} details.`, errors });
        }
        await beforeWrite?.(values, { ...context(ownerId), id: req.params.id });
        const doc = await Model.findOneAndUpdate(scope, { $set: values }, { new: true, runValidators: true });
        if (!doc) return notFound(res);
        await afterChange?.(context(ownerId));
        res.json({ message: `${config.label} updated.`, data: doc });
      } catch (error) { next(error); }
    },

    remove: async (req, res, next) => {
      try {
        const ownerId = req.auth.sub;
        const doc = await Model.findOneAndDelete({ _id: req.params.id, [ownerField]: ownerId });
        if (!doc) return notFound(res);
        await afterChange?.(context(ownerId));
        res.json({ message: `${config.label} deleted.`, data: { _id: doc._id } });
      } catch (error) { next(error); }
    },

    listPublic: async (req, res, next) => {
      try {
        const ownerId = await resolvePublishedOwner(req.params.listingId);
        if (!ownerId) return res.status(404).json({ message: "Listing not found." });
        const items = await Model.find({ [ownerField]: ownerId, ...(publicFilter?.() ?? {}) }).sort(sort).select(`-${ownerField} -__v`);
        res.json({ data: items });
      } catch (error) { next(error); }
    },
  };
}
