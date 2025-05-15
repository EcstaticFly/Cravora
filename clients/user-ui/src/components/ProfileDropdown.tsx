"use client";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";
import { Avatar } from "@heroui/avatar";
import React from "react";

const ProfileDropdown = () => {
  return (
    <div className="flex">
      <Dropdown placement="bottom-end">
        <DropdownTrigger>
          <Avatar
            as="button"
            className="transition-transform size-10 cursor-pointer overflow-hidden !rounded-full"
            src="https://avatars.githubusercontent.com/u/165584415?v=4"
          />
        </DropdownTrigger>
        <DropdownMenu
          aria-label="Profile Actions"
          variant="flat"
          className="w-60 p-2 space-y-1"
        >
          <DropdownItem key="profile" className="h-14 gap-1 flex flex-col items-start">
            <p className="text-sm text-gray-500">Signed in as</p>
            <p className="font-semibold text-sm">support@cravora.com</p>
          </DropdownItem>
          <DropdownItem key="settings" className=" rounded-md px-2 py-2">
            My Profile
          </DropdownItem>
          <DropdownItem key="all_orders" className=" rounded-md px-2 py-2">
            All Orders
          </DropdownItem>
          <DropdownItem key="seller" className=" rounded-md px-2 py-2">
            Apply for seller account
          </DropdownItem>
          <DropdownItem
            key="logout"
            className="hover:bg-red-100 text-red-600 rounded-md px-2 py-2"
          >
            Logout
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};

export default ProfileDropdown;
