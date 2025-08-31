import { Fragment, useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import Link from 'next/link';
// import { signOut } from 'next-auth/react';

const ArtistProfileDropdown = ({ artistProfile }) => {
  const [isOpen, setIsOpen] = useState(false);

  const signout = () => {
    console.log("signout")
  }

  return (
    <Menu as="div" className="relative ml-3 bg-gray-800/30 backdrop-blur-lg   pl-3 pr-3 rounded-3xl pt-1 pb-1 border border-gray-500 border-t-white/30 border-l-white/30  shadow-2xl  ">
      <div className="flex items-center hover:drop-shadow-[0_0_8px_rgba(147,51,234,0.8)] ">
        <Menu.Button className="flex items-center max-w-xs text-sm rounded-full focus:outline-none group ">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-0.5 rounded-full ">
            <div className="bg-gray-800 rounded-full p-1">
              {artistProfile.avatar ? (
                <img 
                  src={artistProfile.avatar} 
                  alt={artistProfile.name} 
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="bg-gray-700 border-2 border-dashed rounded-full w-10 h-10" />
              )}
            </div>
          </div>
          <span className="ml-3 text-gray-200 group-hover:text-white hidden md:block font-special-regular">
            {artistProfile.name}
          </span>
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-gray-800 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none border border-gray-700">
          {/* User Info */}
          <div className="px-4 py-3 border-b border-gray-700">
            <p className="text-sm font-medium text-white truncate font-special-regular">
              {artistProfile.name} {artistProfile.prenom}
            </p>
          </div>

          {/* Menu Items */}
          <Menu.Item>
            {({ active }) => (
              <Link
                href="profile/manage-profile"
                className={`${
                  active ? 'bg-gray-700 font-special-regular' : ''
                } block px-4 py-2 text-sm text-gray-300 font-special-regular`}
              >
                Manage Profile
              </Link>
            )}
          </Menu.Item>

          <Menu.Item>
            {({ active }) => (
              <Link
                href="profile/profile-preview"
                className={`${
                  active ? 'bg-gray-700 font-special-regular' : ''
                } block px-4 py-2 text-sm text-gray-300 font-special-regular`}
              >
                Profile Preview
              </Link>
            )}
          </Menu.Item>
          
          <Menu.Item>
            {({ active }) => (
              <Link
                href="settings"
                className={`${
                  active ? 'bg-gray-700 font-special-regular' : ''
                } block px-4 py-2 text-sm text-gray-300 font-special-regular`}
              >
                Settings
              </Link>
            )}
          </Menu.Item>
          
          <Menu.Item>
            {({ active }) => (
              <Link
                href="/support"
                className={`${
                  active ? 'bg-gray-700 font-special-regular' : ''
                } block px-4 py-2 text-sm text-gray-300 font-special-regular`}
              >
                Help & Support
              </Link>
            )}
          </Menu.Item>
          
          <div className="border-t border-gray-700 my-1" />
          
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={() => signout()}
                className={`${
                  active ? 'bg-gray-700 font-special-regular' : ''
                } block w-full text-left px-4 py-2 text-sm text-red-500  font-special-regular`}
              >
                Log Out
              </button>
            )}
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default ArtistProfileDropdown;