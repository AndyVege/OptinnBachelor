"use client";
import React from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faCheck } from "@fortawesome/free-solid-svg-icons";

type selectMenuProps = {
    options: string[] | number[];
    open: boolean;
    setOpen: (tab: boolean) => void;
    selected: string | number;
    setSelected: (value: string | number) => void;
  };
const SelectMenu = ({ options,open,setOpen,selected,setSelected}:selectMenuProps) => {
  return (
    <div className="relative w-64">
          {/* Button */}
          <div
            className="border w-32 border-gray-300 bg-white rounded-xl shadow-sm p-2 cursor-pointer flex justify-between items-center"
            onClick={() => setOpen(!open)}
          >
            <span>{selected}</span>
            <FontAwesomeIcon className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} icon={faChevronDown} />
          </div>
    
          {/* Dropdown Menu */}
          {open && (
            <ul className="absolute w-32 mt-1 bg-white border border-gray-300 rounded-md shadow-md z-10 max-h-48 overflow-y-auto">
              {options.map((option, index) => (
                <li
                  key={index}
                  className="p-2 flex justify-between items-center hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setSelected(option);
                    setOpen(false);
                  }}
                >
                  <span>{option}</span>
                  {selected === option && <FontAwesomeIcon icon={faCheck}  className="w-4 h-4 text-green-600" />}
                </li>
              ))}
            </ul>
          )}
    
        </div>
  )
}

export default SelectMenu
