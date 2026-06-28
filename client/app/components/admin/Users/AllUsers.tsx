"use client";

import React, { FC, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { FiMail, FiUserPlus, FiX } from "react-icons/fi"; 
import { 
  useGetAllUsersQuery, 
  useUpdateUserRoleMutation, 
  useDeleteUserMutation 
} from "../../../../redux/features/user/userApi"; 
import Loader from "../../Loader/Loader";
import { format } from "timeago.js";
import { toast } from "react-hot-toast";

type Props = {
  isTeam?: boolean; 
};

const AllUsers: FC<Props> = ({ isTeam = false }) => {

  const { data, isLoading, refetch } = useGetAllUsersQuery({});
  const [updateUserRole, { isLoading: isUpdatingRole }] = useUpdateUserRoleMutation();
  const [deleteUser, { isLoading: isDeletingUser }] = useDeleteUserMutation();


  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [addTeamModalOpen, setAddTeamModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");
  
  // Form States for Add Team Member
  const [memberEmail, setMemberEmail] = useState("");
  const [memberRole, setMemberRole] = useState("admin");

  const allUsers = data?.users || [];


  const filteredUsers = isTeam 
    ? allUsers.filter((user: any) => user.role === "admin")
    : allUsers;

  const handleDeleteConfirm = async () => {
    if (!selectedUserId) return;
    
    try {
  
      await deleteUser(selectedUserId).unwrap();
      
      toast.success("Account permanently removed successfully!");
      setDeleteModalOpen(false);
      setSelectedUserId("");
      refetch(); // Reload live roster metrics from the server
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to remove user node from repository.");
    }
  };

  // 🛠️ HANDLER: Add Team Member (Updates role of an existing user by passing their email/id)
  const handleAddTeamMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberEmail.trim()) {
      toast.error("Please provide a valid account email string.");
      return;
    }

    // Find the user object in your current pool that matches the entered email
    const targetUser = allUsers.find(
      (user: any) => user.email.toLowerCase() === memberEmail.trim().toLowerCase()
    );

    if (!targetUser) {
      toast.error("No registered account found with this email address.");
      return;
    }

    try {
      // ✅ Triggers your updateUserRole RTK Mutation endpoint using the target user's ID
      await updateUserRole({ id: targetUser._id, role: memberRole }).unwrap();
      
      toast.success(`${targetUser.name || "User"} promoted to ${memberRole} successfully!`);
      setAddTeamModalOpen(false);
      setMemberEmail("");
      refetch(); // Reload live roster to reflect role changes
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to alter account authorization properties.");
    }
  };

  return (
    <div className="w-full p-4 sm:p-6 md:p-10 font-Poppins box-border text-slate-800 dark:text-gray-100">
      
      {/* 🚀 HEADER SECTION */}
      <div className="w-full flex flex-col gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {isTeam ? "Manage Team Members" : "Platform Users Overview"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-gray-400 mt-1 max-w-[750px]">
            {isTeam 
              ? "Administrate workspace permissions, update security clearings, and configure operational access tokens."
              : "Manage profiles, view roles, track student enrollment metrics, and monitor portal registration details."
            }
          </p>
        </div>

        {/* Add Team Member Trigger */}
        {isTeam && (
          <button
            type="button"
            onClick={() => setAddTeamModalOpen(true)}
            className="flex items-center justify-center gap-2 px-5 h-[40px] bg-[#37a39a] hover:bg-[#2d857e] text-white text-sm font-medium rounded-xl transition-all duration-200 shadow-md shadow-[#37a39a]/10 select-none whitespace-nowrap w-fit mt-1"
          >
            <FiUserPlus size={16} />
            <span>Add Team Member</span>
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="h-[50vh] flex items-center justify-center">
          <Loader />
        </div>
      ) : filteredUsers.length > 0 ? (
        /* 🗂️ RESPONSIVE CARD GRID LAYOUT */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredUsers.map((item: any) => {
            const initialLetter = item.name ? item.name.charAt(0).toUpperCase() : "?";

            return (
              <div
                key={item._id}
                className="w-full flex flex-col bg-white dark:bg-[#0b0c14] border border-gray-200/60 dark:border-white/10 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 group relative overflow-hidden"
              >
                {/* 🖼️ AVATAR INITIAL PLACEHOLDER SECTION */}
                <div className="w-full aspect-video relative overflow-hidden bg-slate-100 dark:bg-[#111322] border-b border-gray-200/60 dark:border-white/10 flex items-center justify-center select-none">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-br from-[#37a39a]/10 to-[#37a39a]/30 text-[#37a39a] text-2xl font-bold shadow-inner">
                    {initialLetter}
                  </div>

                  {/* Floating Account Role Tag */}
                  <div
                    className={`absolute top-2 right-2 border px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider shadow-sm backdrop-blur-sm ${
                      item.role === "admin"
                        ? "bg-rose-500/10 border-rose-500/20 text-rose-500"
                        : "bg-[#37a39a]/10 border-[#37a39a]/20 text-[#37a39a]"
                    }`}
                  >
                    {item.role || "user"}
                  </div>
                </div>

                {/* 📝 CORE CARD CONTENT FIELDS */}
                <div className="p-5 flex-grow flex flex-col justify-between">
                  <div className="space-y-2">
                    {/* USER ID BADGE */}
                    <div>
                      <span
                        title={item._id || "No ID Available"}
                        className="text-[10px] font-mono font-medium bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-md cursor-pointer select-all"
                      >
                        ID: {item._id ? `${item._id.slice(0, 8)}...` : "N/A"}
                      </span>
                    </div>

                    {/* USER NAME */}
                    <h3
                      title={item.name}
                      className="text-[16px] font-semibold text-slate-800 dark:text-gray-100 line-clamp-1 tracking-wide leading-none group-hover:text-[#37a39a] transition-colors duration-200 cursor-pointer"
                    >
                      {item.name || "Unnamed Account"}
                    </h3>

                    {/* USER EMAIL */}
                    <p
                      title={item.email}
                      className="text-xs text-slate-500 dark:text-gray-400 truncate tracking-wide cursor-pointer"
                    >
                      {item.email}
                    </p>

                    {/* REGISTRATION TIMESTAMP */}
                    <div className="text-[11px] text-slate-400 dark:text-slate-500 font-medium tracking-wide pt-1">
                      Joined {format(item.createdAt || item.joinedAt)}
                    </div>
                  </div>

                  {/* 💳 BOTTOM FOOTER METRICS & ACTIONS */}
                  <div className="pt-3 border-t border-gray-100 dark:border-white/[0.04] flex items-center justify-between mt-5">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[9px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">
                        Purchased
                      </span>
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        {item.courses?.length || item.purchasedCourses || 0} Courses
                      </span>
                    </div>

                    {/* ACTION CONTROLS */}
                    <div className="flex items-center gap-1">
                      {/* GMAIL HANDLER */}
                      <a
                        href={`https://mail.google.com/mail/?view=cm&fs=1&to=${item.email}&su=Message+from+Platform+Admin`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center p-2 rounded-xl text-slate-400 dark:text-gray-500 hover:bg-[#37a39a]/10 hover:text-[#37a39a] dark:hover:text-[#37a39a] transition-all duration-200"
                        title={`Email ${item.email}`}
                      >
                        <FiMail size={16} />
                      </a>

                      {/* DELETE TRIGGER */}
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedUserId(item._id);
                          setDeleteModalOpen(true);
                        }}
                        className="inline-flex items-center justify-center p-2 rounded-xl text-slate-400 dark:text-gray-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 hover:text-rose-500 dark:hover:text-rose-400 transition-all duration-200"
                        title="Delete User Account"
                      >
                        <AiOutlineDelete size={17} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Decorative top hover line accent */}
                <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-transparent group-hover:bg-[#37a39a] transition-colors duration-200" />
              </div>
            );
          })}
        </div>
      ) : (
        /* ZERO STATE FALLBACK */
        <div className="w-full py-16 bg-white dark:bg-[#0b0c14] border border-gray-200/60 dark:border-white/10 rounded-2xl text-center shadow-sm">
          <p className="text-sm text-slate-400 dark:text-gray-500 font-medium">
            {isTeam 
              ? "No administrator team accounts discovered in this sector."
              : "No registered users discovered in your database repository."
            }
          </p>
        </div>
      )}

      {/* 📋 POPUP MODAL 1: ADD NEW TEAM MEMBER */}
      {addTeamModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-[450px] bg-white dark:bg-[#0b0c14] border border-gray-100 dark:border-white/10 rounded-2xl shadow-xl overflow-hidden relative p-6 font-Poppins">
            
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-white/5 mb-5">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Add New Team Member</h2>
              <button 
                type="button" 
                disabled={isUpdatingRole}
                onClick={() => setAddTeamModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-gray-300 transition-colors disabled:opacity-50"
              >
                <FiX size={18} />
              </button>
            </div>

            <form onSubmit={handleAddTeamMember} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Account Email Address
                </label>
                <input
                  type="email"
                  required
                  disabled={isUpdatingRole}
                  value={memberEmail}
                  onChange={(e) => setMemberEmail(e.target.value)}
                  placeholder="e.g., user@skillstack.com"
                  className="w-full bg-slate-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 h-[44px] text-sm text-slate-800 dark:text-gray-100 focus:outline-none focus:border-[#37a39a] transition-all placeholder:text-slate-400 disabled:opacity-60"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Assigned Clearance Role
                </label>
                <select
                  disabled={isUpdatingRole}
                  value={memberRole}
                  onChange={(e) => setMemberRole(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 h-[44px] text-sm text-slate-800 dark:text-gray-100 focus:outline-none focus:border-[#37a39a] transition-all cursor-pointer disabled:opacity-60"
                >
                  <option value="admin" className="bg-white dark:bg-[#0b0c14]">Admin</option>
                  <option value="user" className="bg-white dark:bg-[#0b0c14]">User (Student)</option>
                </select>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100 dark:border-white/5 mt-6">
                <button
                  type="button"
                  disabled={isUpdatingRole}
                  onClick={() => setAddTeamModalOpen(false)}
                  className="px-4 h-[38px] text-xs font-medium text-slate-500 dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-white/5 rounded-xl transition-all disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdatingRole}
                  className="px-5 h-[38px] bg-[#37a39a] hover:bg-[#2d857e] text-white text-xs font-medium rounded-xl transition-all shadow-md shadow-[#37a39a]/5 flex items-center gap-2 disabled:opacity-80"
                >
                  {isUpdatingRole && (
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  )}
                  <span>{isUpdatingRole ? "Updating..." : "Confirm Member"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ⚠️ POPUP MODAL 2: DELETE ACCOUNT CONFIRMATION */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-[400px] bg-white dark:bg-[#0b0c14] border border-gray-100 dark:border-white/10 rounded-2xl shadow-xl p-6 text-center">
            
            <div className="w-12 h-12 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <AiOutlineDelete size={22} />
            </div>

            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Permanent Deletion</h2>
            <p className="text-sm text-slate-500 dark:text-gray-400 leading-relaxed mb-6">
              Are you sure you want to delete this user? This action cannot be undone.
            </p>

            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                disabled={isDeletingUser}
                onClick={() => {
                  setDeleteModalOpen(false);
                  setSelectedUserId("");
                }}
                className="w-1/2 h-[40px] text-xs font-medium text-slate-500 dark:text-gray-400 border border-gray-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 rounded-xl transition-all disabled:opacity-50"
              >
                No, Keep Account
              </button>
              <button
                type="button"
                disabled={isDeletingUser}
                onClick={handleDeleteConfirm}
                className="w-1/2 h-[40px] bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium rounded-xl transition-all shadow-md shadow-rose-600/10 flex items-center justify-center gap-2 disabled:opacity-80"
              >
                {isDeletingUser && (
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                <span>{isDeletingUser ? "Deleting..." : "Yes, Delete User"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AllUsers;