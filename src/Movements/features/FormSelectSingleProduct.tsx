import { Controller, useFormContext } from "react-hook-form";

import { useMemo } from "react";
import { CreateMovementsSchema } from "Movements/schemas/CreateMovementsSchema";
import { FormSelect } from "Base/components";
import useProductsOptions from "Movements/hooks/useProductsOptions";

const FormSelectSingleProduct = () => {
  const { options, loading } = useProductsOptions();
  const {
    control,
    formState: { errors },
  } = useFormContext<CreateMovementsSchema>();

  const optionsFiltered = useMemo(
    () => options.filter((option) => option.value),
    [options]
  );

  return (
    <>
      <Controller
        control={control}
        name="productId"
        render={({ field }) => (
          <FormSelect
            ref={field.ref}
            isRequired
            errorMessage={
              errors.warehouseOriginId?.message
                ? "Debe seleccionar un producto"
                : undefined
            }
            isLoading={loading}
            label={"Seleccionar producto"}
            name={field.name}
            options={optionsFiltered}
            value={
              field.value &&
              "value" in field.value &&
              field.value.value !== null
                ? field.value
                : null
            }
            onChange={field.onChange}
            // Asegúrate de que el componente pueda recibir clicks correctamente
            className="form-select"
          />
        )}
      />
    </>
  );
};

export default FormSelectSingleProduct;
