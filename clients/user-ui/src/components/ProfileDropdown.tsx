"use client";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";
import { Avatar } from "@heroui/avatar";
import React, { useEffect, useState } from "react";
import { CgProfile } from "react-icons/cg";
import AuthScreen from "../screens/AuthScreen";
import useUser from "../hooks/useUser";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

const ProfileDropdown = () => {
  const [signedIn, setSignedIn] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { user, loading } = useUser();

  useEffect(() => {
    if (!loading) {
      setSignedIn(!!user);
    }
  }, [loading, user]);

  const handleLogout = () => {
    Cookies.remove("access_token");
    Cookies.remove("refresh_token");
    toast.success("Logout successful!");
    setTimeout(() => {
      window.location.reload();
    }, 1200);
  };

  return (
    <div className="flex">
      {signedIn ? (
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Avatar
              as="button"
              className="transition-transform size-8 cursor-pointer overflow-hidden !rounded-full"
              src={user?.avatar?.url}
            />
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Profile Actions"
            variant="flat"
            className="w-60 p-2 space-y-1"
          >
            <DropdownItem
              key="profile"
              className="h-14 gap-1 flex flex-col items-start"
            >
              <p className="text-sm text-gray-400">Signed in as</p>
              <p className="font-semibold text-sm">{user?.email}</p>
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
              className="hover:bg-red-200 text-red-600 rounded-md px-2 py-2"
              onClick={handleLogout}
            >
              Logout
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      ) : (
        <CgProfile
          className="size-8 cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        />
      )}
      {isOpen && <AuthScreen setIsOpen={setIsOpen} />}
    </div>
  );
};

export default ProfileDropdown;
