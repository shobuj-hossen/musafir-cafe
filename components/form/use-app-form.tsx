import { createFormHook, createFormHookContexts } from "@tanstack/react-form"
import { TextField } from "./text-field"
import { PasswordField } from "./password-field"

export const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts()

export const { useAppForm, withForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    TextField,
    PasswordField,
  },
  formComponents: {},
})
