import { useSearchParams } from "react-router-dom";
import Select from "./Select";

function FilterBy({
  filterField,
  options,
  removeField = "",
  removeFields = [],
  value,
  onChange,
  onClick,
}) {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentFilterValue =
    value ?? searchParams.get(filterField) ?? options.at(0).value;

  function defaultChange(e) {
    searchParams.set(filterField, e.target.value);
    if (removeField) searchParams.delete(removeField);
    removeFields.forEach((field) => searchParams.delete(field));
    searchParams.set("page", "1");
    setSearchParams(searchParams);
  }

  return (
    <Select
      options={options}
      onChange={onChange || defaultChange}
      onClick={onClick}
      value={currentFilterValue}
      type="white"
    />
  );
}

export default FilterBy;
