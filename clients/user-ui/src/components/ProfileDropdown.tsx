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
import { signOut, useSession } from "next-auth/react";
import { addUserToDB } from "../actions/register-user";

const ProfileDropdown = () => {
  const [signedIn, setSignedIn] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { user, loading } = useUser();
  const { data } = useSession();

  useEffect(() => {
    if (!loading) {
      setSignedIn(!!user);
    }
    if (data?.user) {
      setSignedIn(true);
      addUser(data?.user);
    }
  }, [loading, user, isOpen, data]);

  const handleLogout = () => {
    Cookies.remove("access_token");
    Cookies.remove("refresh_token");
    toast.success("Logout successful!");
    setTimeout(() => {
      window.location.reload();
    }, 1200);
  };

  const addUser = async (user: any) => {
    await addUserToDB(user);
  };

  return (
    <div className="flex">
      {signedIn ? (
        <Dropdown
          placement="bottom-end"
          className="bg-[#0A0713] rounded-md border-t border-r border-blue-900"
        >
          <DropdownTrigger>
            <Avatar
              as="button"
              className="transition-transform size-8 cursor-pointer overflow-hidden !rounded-full"
              src={data?.user ? data.user.image : user?.avatar?.url}
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
              <p className="font-semibold text-sm">
                {data?.user ? data.user.email : user?.email}
              </p>
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
              className="hover:border-r hover:border-t hover:border-red-400 text-red-400 rounded-md px-2 py-2"
              onClick={data?.user ? () => signOut() : handleLogout}
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
