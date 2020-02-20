import React from "react";

/*

INPUT:
  items
  currentItem

OUTPUT: 
  listGroup

EVENT: 
  (raise) onItemChange

*/

const ListGroup = ({
  items,
  selectedItem,
  onItemSelect,
  textProperty,
  valueProperty
}) => {
  let classes = "list-group-item";
  return (
    <ul className="list-group">
      {items.map(i => (
        <li
          key={i[textProperty]}
          onClick={() => onItemSelect(i)}
          className={i === selectedItem ? classes + " active" : classes}
        >
          {i[textProperty]}
        </li>
      ))}
    </ul>
  );
};

ListGroup.defaultProps = {
  textProperty: "name",
  valueProperty: "_id"
};

export default ListGroup;
