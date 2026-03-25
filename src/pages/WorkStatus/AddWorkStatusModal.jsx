import React, { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";   
import { GetWithToken, PostWithToken } from "../../ApiMethods/ApiMethods";
import { toastifySuccess } from "../../Utility/Utility";
import CreatableSelect from "react-select/creatable";       

const AddWorkStatusModal = ({ open, onClose, editData, onSuccess }) => {
    console.log(editData, "editData in modal");

    const inputCls =
        "w-full rounded-sm border border-slate-200 px-4 py-2 text-sm outline-none focus:border-blue-500";
// changes
    const [value, setValue] = useState({
        HandlerName: "",
        Datetime: new Date().toISOString().split("T")[0],
        EmployeeID: "",
        LocationName: "",
        WorkStatusID: "",
        WorkStatus: "",
        PartyID: "",
        PartyName: "",
        Description: ""
    });
   
    const [items, setItems] = useState([]);
    const[items2,setItems2]=useState([]);
    const[items3,setItems3]=useState([]);

    const [itemlist, setItemList] = useState([]); 
const [selectedItems, setSelectedItems] = useState([]); 

const GetData_location = async () => {
        
        try {
           const res = await GetWithToken("PermissionUser/GetDropDown_User");
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
            IsPartyStatus: 1,
        };
        try {
            const res = await PostWithToken("AssignHistory/GetDropDown_Staus", val);
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
   

useEffect(()=>{
    GetData_location();
    GetData_Driver();
    GetData_Party();
    
},[])


const options = itemlist.map(item => ({
  value: item.ItemID,
  label: item.ItemName,
  Remaining:item.RemaingStock,
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
      
        if (!value.PartyID) e.PartyID = "Party is required";
        
        // if (!value.Datetime) e.Datetime = "Datetime required";

        setErrors(e);
        return Object.keys(e).length === 0;
    };


    useEffect(() => {
        if (editData) {
            setValue({
                HandlerName: editData.HandlerName ?? "",
                Datetime: editData.Datetime ?? ""
            });
        }
    }, [editData]);

    useEffect(() => {
        if (!editData && open) {
            setValue({
                HandlerName: "",
                Datetime: "",
                PartyID: "",
                PartyName: "",
                Description: "",

            });
            setErrors({});
        }
    }, [editData, open]);
    

const handleSubmit = async () => {
  if (!validate()) return;

  const payload = {
    CreatedByUser: "1",
    Datetime: value.Datetime,
    WorkStatusID: value.WorkStatusID,
    WorkStatus: value.WorkStatus,
    PartyID: value.PartyID,
    AssignID: value.AssignID || 0,
    Description: value.Description
  };

  try {
    
    const url = editData?.AssignID
      ? "AssignWork/Update_AssignWork"   
      : "AssignWork/Insert_AssignWork";  

    const res = await PostWithToken(url, payload);

    if (res) {
      toastifySuccess(
        editData?.AssignID
          ? "WorkStatus Updated Successfully"
          : "WorkStatus Added Successfully"
      );

      onClose?.();
      onSuccess?.();
      GetData_Driver();
      refershdvalues();
    }

  } catch (error) {
    console.error(error);
  }
};
useEffect(()=>{
    if(editData){
        setValue({
            EmployeeID: editData.EmployeeID,
            LocationName: editData.LocationName,
            WorkStatusID: editData.WorkStatusID,
            WorkStatus: editData.WorkStatus,
            PartyID: editData.PartyID,
            PartyName: editData.PartyName,
            Description: editData.Description,
            Datetime: editData.Datetime ? editData.Datetime.split("T")[0] : ""
        })
    }
},[editData])

    if (!open) return null;

  
   const handleLocationChange = (e) => {

  const id = e.target.value;

  const location = items.find(
    (item) => item.EmployeeID == id
  );

  setValue({
    ...value,
    EmployeeID: location.EmployeeID,
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

// const handleDriverChange = (e) => {

//   const id = e.target.value;

//   const driver = items2.find(
//     (item) => item.WorkStatusID == id
//   );

//   setValue({
//     ...value,
//     WorkStatusID: driver.WorkStatusID,
//     WorkStatus: driver.WorkStatus
//   });

// };

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
  value: d.WorkStatusID,
  label: d.Description
}));

const refershdvalues=()=>{
  setValue((prev)=>({
    ...prev,
         EmployeeID: "",
        LocationName: "",
        WorkStatusID: "",
        WorkStatus: "",
        PartyID: "",
        PartyName: "",
        Description: ""
  }))
  setSelectedItems([]);
  setItemList([]);
}




    return (
        <div className=" fixed inset-0 z-50">

            <div className="absolute inset-0 bg-black/40" onClick={onClose}></div>

            <div className="relative flex items-center justify-center min-h-screen p-4">

                <div className=" max-h-150 overflow-y-auto  bg-white w-full max-w-md rounded-xl shadow-lg p-6">

                    <div className="flex justify-between mb-4">
                        <h2 className="text-lg font-semibold">
                            {editData ? "Edit WorkStatus" : "Add WorkStatus"}
                        </h2>

                        <button onClick={onClose}>
                            <FiX size={20} />
                        </button>
                    </div>

                    <div className="space-y-4">



<div>
  <label className="text-sm font-medium">
    WorkStatus
  </label>

<CreatableSelect
  value={
    value.WorkStatus
      ? { label: value.WorkStatus, value: value.WorkStatusID }
      : null
  }
  onChange={(opt) =>
    setValue((prev) => ({
      ...prev,
      WorkStatusID: opt?.value || "",
      WorkStatus: opt?.label || ""
    }))
  }
  onCreateOption={(inputValue) =>
    setValue((prev) => ({
      ...prev,
      WorkStatusID: "",       
      WorkStatus: inputValue
    }))
  }
  options={driverOptions}
  placeholder="Select or create WorkStatus..."
  styles={selectStyles}
  isClearable
  formatCreateLabel={(inputValue) => `Add "${inputValue}"`}
/>
 
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
    Description
  </label>

  <input type="text"
    value={value.Description}
    onChange={handleChange("Description")}
    className={inputCls}
  />

 
</div>





                 <div>
  <label className="text-sm font-medium">
    Date
  </label>

  <input
    type="date"
    value={value.Datetime}
    onChange={handleChange("Datetime")}
    className={inputCls}
  />

  
</div>



                    </div>

                    <div className="flex justify-end mt-6">

                        <button
                            onClick={handleSubmit}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                        >
                            {editData ? "Edit" : "Save"}
                        </button>

                    </div>

                </div>

            </div>
        </div>
    );
};

export default AddWorkStatusModal;