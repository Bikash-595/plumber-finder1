import { publicAccount } from "../services/authResponse.js";

/** GET /me for any account type. */
export function createAccountController({ Model }) {
  return {
    me: async (req, res, next) => {
      try {
        const account = await Model.findById(req.auth.sub);
        if (!account) return res.status(404).json({ message: "Account not found." });
        res.json({ account: publicAccount(account) });
      } catch (error) { next(error); }
    },
  };
}
