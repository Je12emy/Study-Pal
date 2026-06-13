import { createFormHook } from "@tanstack/react-form"

import { FormField } from "./field"
import { fieldContext, formContext } from "./contexts"

export const studyAreaFormHook = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    TextField: FormField,
  },
  formComponents: {},
})

export { normalizeStudyAreaName, validateStudyAreaName } from "./helpers"
