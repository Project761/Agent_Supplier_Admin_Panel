import React, { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";   
import { PostWithToken } from "../../ApiMethods/ApiMethods";
import { toastifySuccess } from "../../Utility/Utility";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";

const OutItemModal = ({ open, onClose, editData, onSuccess }) => {

    const inputCls =
        "w-full rounded-sm border border-slate-200 px-4 py-2 text-sm outline-none focus:border-blue-500";

    const [value, setValue] = useState({
        HandlerName: "",
        OutDate: new Date().toISOString().split("T")[0],
        LocationID: "",
        LocationName: "",
        DriverID: "",
        DriverName: "",
        PartyID: "",
        PartyName: ""
    });
   
    const [items, setItems] = useState([]);
    const[items2,setItems2]=useState([]);
    const[items3,setItems3]=useState([]);

    const [itemlist, setItemList] = useState([]); 
const [selectedItems, setSelectedItems] = useState([]); 

const GetData_location = async () => {
        const val = {
            LocationID: "",
        };
        try {
            const res = await PostWithToken("ItemOut/GetDropDownData_Locations", val);
            console.log(res, "res1");


            if (res) {
                setItems(res);
            } else {
                setItems([])
            }
        } catch (error) {
            console.error(error);
        }
    };

    const GetData_Driver = async () => {
        const val = {
            LocationID: "",
        };
        try {
            const res = await PostWithToken("ItemOut/GetDropDownData_Driver", val);
            console.log(res, "res2");
            if (res) {
                setItems2(res);
            } else {
                setItems2([])
            }
        } catch (error) {
            console.error(error);
        }
    };
     const GetData_Party = async () => {
        const val = {
            Name: "",
        };
        try {
            const res = await PostWithToken("Party/GetDropDown_Party", val);
            console.log(res, "partyname");
            if (res) {
                setItems3(res);
            } else {
                setItems3([])
            }
        } catch (error) {
            console.error(error);
        }
    };
    const GetData_Itemlist = async () => {
           const val = {
               LocationID: value.LocationID,
           };
           try {
               const res = await PostWithToken("MasterItems/GetDropDownData_MasterItems", val);
               console.log(res, "itemlist");
               if (res) {
                   setItemList(res);
               } else {
                   setItemList([])
               }
           } catch (error) {
               console.error(error);
           }
       };

useEffect(()=>{
    GetData_location();
    GetData_Driver();
    GetData_Party();
    
},[])
useEffect(()=>{
    GetData_Itemlist();
},[value.LocationID])

const options = itemlist.map(item => ({
  value: item.ItemID,
  label: item.ItemName
}));
    const [errors, setErrors] = useState({});

    const handleChange = (key) => (e) => {
        setValue((prev) => ({
            ...prev,
            [key]: e.target.value
        }));
    };

    const validate = () => {
        const e = {};
        
        if (!value.OutDate) e.OutDate = "OutDate required";

        setErrors(e);
        return Object.keys(e).length === 0;
    };


    useEffect(() => {
        if (editData) {
            setValue({
                HandlerName: editData.HandlerName ?? "",
                OutDate: editData.OutDate ?? ""
            });
        }
    }, [editData]);

    useEffect(() => {
        if (!editData && open) {
            setValue({
                HandlerName: "",
                OutDate: ""
            });
            setErrors({});
        }
    }, [editData, open]);
    

   const handleSubmit = async () => {

  if (!validate()) return;

  const payload = {
    CreatedByUser: "1",
    OutDate: value.OutDate,
    // HandlerName: value.HandlerName,
    LocationID: value.LocationID,
    DriverID: value.DriverID,
    DriverName: value.DriverName,
    PartyID: value.PartyID,
    itemlist: selectedItems.map((item) => ({
      ItemID: item.ItemID,
      Qty: item.Qty
    }))
  };
  console.log(payload, "payload");
  console.log(value,"value")

  try {

    const res = await PostWithToken(
      "ItemOut/Insert_ItemOut",
      payload
    );

    if (res) {
      toastifySuccess("Item Out Added Successfully");
      onClose?.();
      onSuccess?.();
    }

  } catch (error) {
    console.error(error);
  }

};

    if (!open) return null;

  
   const handleLocationChange = (e) => {

  const id = e.target.value;

  const location = items.find(
    (item) => item.LocationID == id
  );

  setValue({
    ...value,
    LocationID: location.LocationID,
    LocationName: location.LocationName
  });
};
const handleItemSelect = (item) => {

 const exists = selectedItems.find(
  (i) => i.ItemID === item.ItemID
 );

 if (exists) {

  setSelectedItems(
   selectedItems.filter((i) => i.ItemID !== item.ItemID)
  );

 } else {

  setSelectedItems([
   ...selectedItems,
   { ItemID: item.ItemID, Qty: "" }
  ]);

 }
};
const handleQtyChange = (id, qty) => {

 setSelectedItems(
  selectedItems.map((item) =>
   item.ItemID === id
    ? { ...item, Qty: qty }
    : item
  )
 );

};


const handlePartyChange = (e) => {

  const id = e.target.value;

  const party = items3.find(
    (item) => item.PartyID == id
  );

  setValue({
    ...value,
    PartyID: party.PartyID,
    PartyName: party.Name
  });

};

const handleDriverChange = (e) => {

  const id = e.target.value;

  const driver = items2.find(
    (item) => item.DriverID == id
  );

  setValue({
    ...value,
    DriverID: driver.DriverID,
    DriverName: driver.DriverName
  });

};

const selectStyles = {
  control: (base, state) => ({
    ...base,
    borderRadius: 6,
    borderColor: state.isFocused ? "#2563eb" : "#e2e8f0",
    boxShadow: state.isFocused ? "0 0 0 1px #2563eb" : "none",
    minHeight: 40,
  }),
};
const driverOptions = items2.map((d) => ({
  value: d.DriverID,
  label: d.DriverName
}));

const handleCreateDriver = async (inputValue) => {

  try {

    const payload = {
      DriverName: inputValue
    };

    const res = await PostWithToken("ItemOut/Insert_Driver", payload);

    if (res) {

      // dropdown refresh
      await GetData_Driver();

      // newly created driver select karna
      setValue((prev) => ({
        ...prev,
        DriverID: "", 
        DriverName: inputValue
      }));

    }

  } catch (error) {
    console.error(error);
  }

};



    return (
        <div className=" fixed inset-0 z-50">

            <div className="absolute inset-0 bg-black/40" onClick={onClose}></div>

            <div className="relative flex items-center justify-center min-h-screen p-4">

                <div className=" max-h-150 overflow-y-auto  bg-white w-full max-w-md rounded-xl shadow-lg p-6">

                    <div className="flex justify-between mb-4">
                        <h2 className="text-lg font-semibold">
                            {editData ? "Add Out Item" : "Add Out Item"}
                        </h2>

                        <button onClick={onClose}>
                            <FiX size={20} />
                        </button>
                    </div>

                    <div className="space-y-4">

                        {/* <div>
                            <label className="text-sm font-medium">
                                Handler Name
                            </label>

                            <input
                                value={value.HandlerName}
                                onChange={handleChange("HandlerName")}
                                className={inputCls}
                            />

                            {errors.HandlerName && (
                                <p className="text-red-500 text-xs">
                                    {errors.HandlerName}
                                </p>
                            )}
                        </div> */}

    

<div>
  <label className="text-sm font-medium">
    Location
  </label>

  <select
    value={value.LocationID}
    onChange={handleLocationChange}
    className={inputCls}
  >

    <option value="">Select Location</option>

    {items.map((loc) => (
      <option
        key={loc.LocationID}
        value={loc.LocationID}
      >
        {loc.LocationName||"NaN"}
      </option>
    ))}

  </select>
    {errors.LocationID && (
        <p className="text-red-500 text-xs">
            {errors.LocationID}
        </p>
    )}
</div>
<div>
  <label className="text-sm font-medium">
    Driver
  </label>

<CreatableSelect
  value={
    value.DriverName
      ? { label: value.DriverName, value: value.DriverID }
      : null
  }
  onChange={(opt) =>
    setValue((prev) => ({
      ...prev,
      DriverID: opt?.value || "",
      DriverName: opt?.label || ""
    }))
  }
  onCreateOption={(inputValue) =>
    setValue((prev) => ({
      ...prev,
      DriverID: "",       // new driver hai
      DriverName: inputValue
    }))
  }
  options={driverOptions}
  placeholder="Select or create driver..."
  styles={selectStyles}
  isClearable
  formatCreateLabel={(inputValue) => `Add "${inputValue}"`}
/>
  {errors.DriverID && (
    <p className="text-red-500 text-xs">
      {errors.DriverID}
    </p>
  )}
</div>

<div>
  <label className="text-sm font-medium">
    Party Name
  </label>

  <select
  value={value.PartyID}
  onChange={handlePartyChange}
  className={inputCls}
>

    <option value="">Select Party</option>

    {items3.map((loc) => (
      <option
        key={loc.PartyID}
        value={loc.PartyID}
      >
        {loc.Name}
      </option>
    ))}

  </select>
    {errors.PartyID && (
        <p className="text-red-500 text-xs">
            {errors.PartyID}
        </p>
    )}
</div>
                 <div>
  <label className="text-sm font-medium">
    OutDate
  </label>

  <input
    type="date"
    value={value.OutDate}
    onChange={handleChange("OutDate")}
    className={inputCls}
  />

  {errors.OutDate && (
    <p className="text-red-500 text-xs">
      {errors.OutDate}
    </p>
  )}
</div>

<div>
  <label className="text-sm font-medium">Items</label>

  <div className="max-h-60 overflow-y-auto border rounded p-2">
    {itemlist.map((item) => {

     const selectedItem = selectedItems.find(
 (i) => i.ItemID === item.ItemID
);
      return (
        <div
          key={item.ItemID}
          className="flex items-center justify-between border p-2 rounded mt-2"
        >
          <div className="flex items-center gap-2">

            <input
              type="checkbox"
            checked={!!selectedItem}
              onChange={() => handleItemSelect(item)}
            />

            <span className="font-medium">
              {item.ItemName}
            </span>

          </div>

          {selectedItem && (
            <input
              type="number"
              placeholder="Qty"
              className="border rounded p-1 w-20"
              value={selectedItem.Qty}
              onChange={(e)=>
                handleQtyChange(item.ItemID,e.target.value)
              }
            />
          )}

        </div>
      );
    })}
  </div>

</div>

                    </div>

                    <div className="flex justify-end mt-6">

                        <button
                            onClick={handleSubmit}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                        >
                            {editData ? "Save" : "Save"}
                        </button>

                    </div>

                </div>

            </div>
        </div>
    );
};

export default OutItemModal;