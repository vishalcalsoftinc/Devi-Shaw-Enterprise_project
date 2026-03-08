import { useState } from "react";
import styled from "styled-components";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";
import Checkbox from "../../ui/Checkbox";
import { useScheme1ByItemId } from "../schemes/useScheme1ByItemId";
import { useScheme2ByItemId } from "../schemes/useScheme2ByItemId";
import { useScheme3ByItemId } from "../schemes/useScheme3ByItemId";
import toast from "react-hot-toast";

const ItemCard = styled.div`
  display: grid;
  gap: 1rem;
  padding: 1rem 0.4rem 0.4rem;
`;

const ItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding: 0 0.6rem;

  & span:first-child {
    font-weight: 600;
  }
`;

const ItemMeta = styled.span`
  font-size: 1.2rem;
  color: var(--color-grey-500);
`;

const InputGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
  gap: 1rem;
  padding: 0 0.6rem;
`;

const Field = styled.label`
  display: grid;
  gap: 0.4rem;
  font-size: 1.1rem;
  color: var(--color-grey-500);
`;

const SchemesRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  padding: 0 0.6rem;
  align-items: center;
`;

const SchemeNote = styled.span`
  font-size: 1.1rem;
  color: var(--color-grey-500);
  padding: 0 0.6rem;
`;

function CreateOrderItem({ item, newOrder, setNewOrder }) {
  const {
    id,
    item_name,
    buying_price_per_pt,
    base_selling_price_per_pt,
    available_stock: { pt: available_pt },
  } = item;

  const [selectedScheme, setSelectedScheme] = useState(0);

  const [addScheme1, setAddScheme1] = useState(false);
  const [addScheme2, setAddScheme2] = useState(false);
  const [addScheme3, setAddScheme3] = useState(false);
  const [quantity, setQuantity] = useState(0);
  const [discountPerPt, setDiscountPerPt] = useState(0);
  const [freeItemsString, setFreeItemsString] = useState("");

  const { isLoadingScheme1, scheme_1 } = useScheme1ByItemId(id);
  const { isLoadingScheme2, scheme_2 } = useScheme2ByItemId(id);
  const { isLoadingScheme3, scheme_3 } = useScheme3ByItemId(id);

  const isWorking = isLoadingScheme1 || isLoadingScheme2 || isLoadingScheme3;
  if (isWorking) return null;

  const handleQuantityChange = (event) => {
    const newQuantity = Number(event.target.value) || 0;

    if (newQuantity > available_pt) {
      toast.error(`Only ${available_pt} pt. available in stock.`);
      return;
    }

    setQuantity(newQuantity);
    updateFreeItemsString(selectedScheme, newQuantity);
  };

  const handleDiscountChange = (event) => {
    const newDiscount = Number(event.target.value) || 0;
    setDiscountPerPt(newDiscount);
    updateOrderItem(id, {
      discount: Number((newDiscount * quantity).toFixed(2)),
    });
  };

  const handleAddScheme1Change = (event) => {
    const isChecked = event.target.checked;
    setAddScheme1(isChecked);
    setAddScheme2(false);
    setAddScheme3(false);
    setSelectedScheme(isChecked ? 1 : 0);
    updateFreeItemsString(
      isChecked ? 1 : 0,
      newOrder.order_items.find((item) => item.item_id === id)?.item_quantity
    );
  };

  const handleAddScheme2Change = (event) => {
    const isChecked = event.target.checked;
    setAddScheme2(isChecked);
    setAddScheme1(false);
    setAddScheme3(false);
    setSelectedScheme(isChecked ? 2 : 0);
    updateFreeItemsString(
      isChecked ? 2 : 0,
      newOrder.order_items.find((item) => item.item_id === id)?.item_quantity
    );
  };

  const handleAddScheme3Change = (event) => {
    const isChecked = event.target.checked;
    setAddScheme3(isChecked);
    setAddScheme2(false);
    setAddScheme1(false);
    setSelectedScheme(isChecked ? 3 : 0);
    updateFreeItemsString(
      isChecked ? 3 : 0,
      newOrder.order_items.find((item) => item.item_id === id)?.item_quantity
    );
  };

  const updateFreeItemsString = (scheme, quantity) => {
    const schemeLevel = getSchemeLevel(quantity);
    if (schemeLevel && quantity && scheme !== 0) {
      const schemeData =
        scheme === 1 ? scheme_1 : scheme === 2 ? scheme_2 : scheme_3;
      const free_items = schemeData[`free_${schemeLevel}pt`]?.free_items;
      const schemeDiscount = schemeData[`free_${schemeLevel}pt`]
        ?.discount_per_pt
        ? schemeData[`free_${schemeLevel}pt`]?.discount_per_pt
        : 0;

      setDiscountPerPt(schemeDiscount);

      let temp = "";
      if (free_items) {
        free_items.forEach((free_item) => {
          const { free_item_name, free_item_quantity } = free_item;
          if (Number(free_item_quantity) > 0) {
            temp = `${temp}${free_item_quantity}pc-${free_item_name} ,`;
          }
        });
      }
      setFreeItemsString(temp || "No scheme");
      updateOrderItem(id, {
        free_items: temp ? free_items : [],
        item_quantity: quantity,
        discount: Number((schemeDiscount * quantity).toFixed(2)),
      });
    } else {
      setFreeItemsString("");
      setDiscountPerPt(0);
      updateOrderItem(id, {
        free_items: [],
        item_quantity: quantity,
        discount: 0,
      });
    }
  };

  const updateOrderItem = (itemId, updates) => {
    // console.log(itemId, updates);
    const existingItemIndex = newOrder.order_items.findIndex(
      (item) => item.item_id === itemId
    );
    const updatedOrderItems = [...newOrder.order_items];

    if (existingItemIndex !== -1) {
      if (updates.item_quantity === 0) {
        updatedOrderItems.splice(existingItemIndex, 1);
      } else {
        const updatedItem = {
          ...updatedOrderItems[existingItemIndex],
          ...updates,
        };
        updatedOrderItems[existingItemIndex] = updatedItem;
      }
    } else if (updates.item_quantity > 0) {
      updatedOrderItems.push({
        ...updates,
        item_id: itemId,
        item_name,
        buying_price: buying_price_per_pt,
        selling_price: base_selling_price_per_pt,
      });
    }

    setNewOrder({ ...newOrder, order_items: updatedOrderItems });
    console.log(updatedOrderItems);
  };

  const getSchemeLevel = (quantity) => {
    const levels = [1, 2, 3, 4, 5, 6, 10, 12];
    return levels.includes(quantity) ? quantity : null;
  };

  return (
    <FormRow type="order">
      <ItemCard>
        <ItemHeader>
          <span>{item_name}</span>
          <ItemMeta>
            Rs.{base_selling_price_per_pt} — {available_pt} pt.
          </ItemMeta>
        </ItemHeader>
        <InputGrid>
          <Field htmlFor={`quantity-${id}`}>
            Quantity
            <Input
              type="text"
              id={`quantity-${id}`}
              value={quantity}
              onChange={handleQuantityChange}
              disabled={available_pt <= 0}
            />
          </Field>
          <Field htmlFor={`discountPerPt-${id}`}>
            Discount / pt
            <Input
              type="text"
              id={`discountPerPt-${id}`}
              value={discountPerPt}
              onChange={handleDiscountChange}
              disabled={available_pt <= 0}
            />
          </Field>
        </InputGrid>
        <SchemesRow>
          <Checkbox
            id={`scheme1-${id}`}
            checked={addScheme1}
            onChange={handleAddScheme1Change}
          >
            Scm1
          </Checkbox>
          <Checkbox
            id={`scheme2-${id}`}
            checked={addScheme2}
            onChange={handleAddScheme2Change}
          >
            Scm2
          </Checkbox>
          <Checkbox
            id={`scheme3-${id}`}
            checked={addScheme3}
            onChange={handleAddScheme3Change}
          >
            Scm3
          </Checkbox>
        </SchemesRow>
        {(addScheme1 || addScheme2) && <SchemeNote>{freeItemsString}</SchemeNote>}
      </ItemCard>
    </FormRow>
  );
}

export default CreateOrderItem;
