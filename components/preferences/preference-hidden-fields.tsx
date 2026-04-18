import type { PreferenceDraft } from "@/lib/preferences/use-preferences-draft";

type PreferenceHiddenFieldsProps = {
  draft: PreferenceDraft;
};

export function PreferenceHiddenFields({
  draft,
}: PreferenceHiddenFieldsProps) {
  return (
    <>
      <input type="hidden" name="timezone" value={draft.timezone} />
      <input
        type="hidden"
        name="showEnergyPoints"
        value={draft.showEnergyPoints ? "true" : "false"}
      />
      <input
        type="hidden"
        name="morningReminderEnabled"
        value={draft.morningReminderEnabled ? "true" : "false"}
      />
      <input type="hidden" name="morningReminderTime" value={draft.morningReminderTime} />
      <input
        type="hidden"
        name="reflectionReminderEnabled"
        value={draft.reflectionReminderEnabled ? "true" : "false"}
      />
    </>
  );
}
