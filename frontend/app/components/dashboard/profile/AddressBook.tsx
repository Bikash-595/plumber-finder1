"use client";

import { useState } from "react";
import { FaMapMarkedAlt, FaPlus } from "react-icons/fa";
import { userApi, type Address, type AddressInput } from "@/components/utils/userApi";
import { useUserData } from "../useUserData";
import ConfirmDialog from "../ui/ConfirmDialog";
import Notice from "../ui/Notice";
import Panel from "../ui/Panel";
import { Skeleton } from "../ui/Skeleton";
import AddressCard from "./AddressCard";
import AddressForm from "./AddressForm";
import { errorText } from "./profileOptions";

const MAX = 5;

/** Saved service addresses (up to 5). The default one pre-fills booking and checkout forms. */
export default function AddressBook() {
  const addresses = useUserData(userApi.addresses);
  const [editing, setEditing] = useState<Address | "new" | null>(null);
  const [removing, setRemoving] = useState<Address | null>(null);
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState("");
  const list = addresses.data ?? [];

  const run = async (action: () => Promise<unknown>, onDone?: () => void) => {
    setBusy(true);
    addresses.setError("");
    try { await action(); await addresses.reload(); onDone?.(); } catch (caught) { addresses.setError(errorText(caught, "Could not update your addresses.")); } finally { setBusy(false); }
  };
  const save = async (values: AddressInput) => {
    setBusy(true);
    setFormError("");
    try {
      if (editing === "new") await userApi.addAddress(values);
      else if (editing) await userApi.updateAddress(editing._id, values);
      await addresses.reload();
      setEditing(null);
    } catch (caught) {
      setFormError(errorText(caught, "Could not save this address."));
    } finally {
      setBusy(false);
    }
  };
  const open = (target: Address | "new") => { setFormError(""); setEditing(target); };

  return (
    <Panel title={<span className="flex items-center gap-2"><FaMapMarkedAlt className="h-4 w-4 text-[#b39200]" />Service addresses</span>}
      description={`Where you need plumbing work. Your default address fills in bookings automatically. ${list.length}/${MAX} saved.`}
      action={!editing && list.length < MAX && <button type="button" onClick={() => open("new")} className="inline-flex items-center gap-1.5 rounded-full bg-[#FFD60A] px-4 py-2 text-sm font-bold text-[#0b1f3b] hover:brightness-95"><FaPlus className="h-3 w-3" /> Add address</button>}>
      <div className="space-y-4">
        <Notice>{addresses.error}</Notice>
        {editing && <AddressForm key={editing === "new" ? "new" : editing._id} address={editing === "new" ? undefined : editing} busy={busy} error={formError} onSave={save} onCancel={() => setEditing(null)} />}
        {addresses.loading ? <Skeleton className="h-28 rounded-2xl" /> : list.length === 0 && !editing ? (
          <button type="button" onClick={() => open("new")} className="flex w-full flex-col items-center rounded-2xl border border-dashed border-gray-300 px-6 py-8 text-center hover:border-[#FFD60A] hover:bg-[#FFD60A]/5">
            <FaMapMarkedAlt className="h-6 w-6 text-gray-400" />
            <span className="mt-2 font-semibold text-gray-900">Add your first address</span>
            <span className="mt-1 text-sm text-gray-500">Save time on every booking — and tell plumbers about parking, pets and access in advance.</span>
          </button>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {list.map((address) => (
              <AddressCard key={address._id} address={address} busy={busy}
                onEdit={() => open(address)} onMakeDefault={() => run(() => userApi.updateAddress(address._id, { isDefault: true }))} onRemove={() => setRemoving(address)} />
            ))}
          </div>
        )}
      </div>
      <ConfirmDialog open={Boolean(removing)} title="Remove this address?" confirmLabel="Remove address" busy={busy}
        message={removing ? `“${removing.label}” will be removed.${removing.isDefault && list.length > 1 ? " Your next saved address becomes the default." : ""}` : ""}
        onConfirm={() => { const target = removing; setRemoving(null); if (target) run(() => userApi.removeAddress(target._id), () => { if (editing !== "new" && editing?._id === target._id) setEditing(null); }); }}
        onClose={() => setRemoving(null)} />
    </Panel>
  );
}
