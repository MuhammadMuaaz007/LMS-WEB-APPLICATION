"use client";

import {
  useEditLayoutMutation,
  useGetHeroDataQuery,
} from "../../../../redux/features/layout/LayoutApi";
import React, { useEffect, useState, type FC } from "react";
import Loader from "../../Loader/Loader";
import { AiOutlineDelete, AiOutlinePlusCircle } from "react-icons/ai";
import { BsPencil } from "react-icons/bs";
import { toast } from "react-hot-toast";

type Props = {};

const EditCategories: FC<Props> = () => {
  const { data, isLoading, refetch } = useGetHeroDataQuery("Categories", {
    refetchOnMountOrArgChange: true,
  });
  const [
    editLayout,
    { isLoading: isEditLoading, isSuccess: layoutSuccess, error },
  ] = useEditLayoutMutation();
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Sync database data on initial mount
  useEffect(() => {
    if (data?.layout?.categories && !isLoaded) {
      setCategories(data.layout.categories);
      setIsLoaded(true);
    }
  }, [data, isLoaded]);

  useEffect(() => {
    if (layoutSuccess) {
      toast.success("Categories updated successfully!");
      refetch();
    }
    if (error && "data" in error) {
      toast.error(
        (error as any).data?.message || "Failed to update categories.",
      );
    }
  }, [layoutSuccess, error, refetch]);

  const handleCategoriesChange = (id: string, value: string) => {
    setCategories((prev) =>
      prev.map((cat) => (cat._id === id ? { ...cat, title: value } : cat)),
    );
  };

  const newCategoriesHandler = () => {
    const lastCategory = categories[categories.length - 1];
    if (lastCategory && !lastCategory.title.trim()) {
      return toast.error("Category title cannot be empty!");
    }
    setCategories((prev) => [
      ...prev,
      { _id: Math.random().toString(36).substring(2, 9), title: "" },
    ]);
  };

  const handleDeleteConfirm = () => {
    if (!deletingId) return;
    setCategories((prev) => prev.filter((cat) => cat._id !== deletingId));
    setDeletingId(null);
    toast.success("Category removed from layout draft.");
  };

  const isAnyEmpty = categories.some((cat) => !cat.title.trim());
  const isDataChanged =
    JSON.stringify(data?.layout?.categories || []) !==
    JSON.stringify(categories);

  const editCategoriesHandler = async () => {
    if (isAnyEmpty) {
      return toast.error("All category field entries must contain text!");
    }
    try {
      await editLayout({
        type: "Categories",
        categories: categories.map(({ title }) => ({ title })),
      }).unwrap();
    } catch (err) {}
  };

  const inputTheme =
    "w-full bg-transparent border-b border-transparent hover:border-gray-200 dark:hover:border-white/10 focus:border-[#37a39a] focus:dark:border-[#37a39a] outline-none text-sm sm:text-base font-semibold text-slate-800 dark:text-gray-100 transition-all py-1.5 pr-2";

  return (
    <div className="w-full p-4 sm:p-6 md:p-10 font-Poppins box-border mt-14 md:mt-0 text-slate-800 dark:text-gray-100">
      {/* HEADER SECTION METADATA */}
      <div className="mb-8 max-w-2xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Manage Categories
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-gray-400 mt-1">
            Configure system learning categories, modify operational topics, and
            expand course navigation schema options.
          </p>
        </div>

        {/* ADD CATEGORY BUTTON TRIGGER */}
        <button
          type="button"
          onClick={newCategoriesHandler}
          className="flex items-center justify-center gap-2 px-5 h-[40px] bg-[#37a39a]/10 hover:bg-[#37a39a]/20 text-[#37a39a] text-sm font-semibold rounded-xl transition-all duration-200 select-none whitespace-nowrap w-fit self-start sm:self-auto cursor-pointer"
        >
          <AiOutlinePlusCircle size={18} />
          <span>Add Category</span>
        </button>
      </div>

      {isLoading ? (
        <div className="h-[40vh] flex items-center justify-center">
          <Loader />
        </div>
      ) : (
        <div className="max-w-2xl mx-auto space-y-6">
          {categories?.length > 0 ? (
            /* DYNAMIC CATEGORY ITEMS CONTAINER CARD */
            <div className="bg-white dark:bg-[#0b0c14] border border-gray-200/60 dark:border-white/10 rounded-2xl p-4 sm:p-6 shadow-sm divide-y divide-gray-100 dark:divide-white/[0.04]">
              {categories.map((item: any, index: number) => (
                <div
                  key={item._id}
                  className="py-4 first:pt-0 last:pb-0 group/row flex items-center justify-between gap-4"
                >
                  {/* Category Title Input and Number Badge */}
                  <div className="flex-1 flex items-center gap-3 min-w-0 pr-2">
                    <span className="text-xs font-mono font-bold text-slate-400 select-none">
                      #{String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="flex items-center gap-2 w-full">
                      <input
                        type="text"
                        className={inputTheme}
                        value={item.title}
                        onChange={(e) =>
                          handleCategoriesChange(item._id, e.target.value)
                        }
                        placeholder="Enter category title..."
                      />
                      <BsPencil className="text-slate-300 dark:text-gray-600 group-hover/row:text-slate-400 dark:group-hover/row:text-gray-400 text-xs flex-shrink-0" />
                    </div>
                  </div>

                  {/* Actions Area (Delete Row Button) */}
                  <div className="flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => setDeletingId(item._id)}
                      className="p-1.5 rounded-lg text-slate-400 dark:text-gray-600 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all duration-150 cursor-pointer"
                      title="Delete Category"
                    >
                      <AiOutlineDelete size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* ZERO STATE FALLBACK */
            <div className="w-full py-16 bg-white dark:bg-[#0b0c14] border border-gray-200/60 dark:border-white/10 rounded-2xl text-center shadow-sm">
              <p className="text-sm text-slate-400 dark:text-gray-500 font-medium mb-4">
                No active categories created yet.
              </p>
              <button
                type="button"
                onClick={newCategoriesHandler}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#37a39a] text-white text-xs font-semibold rounded-xl transition-all shadow-md shadow-[#37a39a]/10 cursor-pointer"
              >
                Create First Category
              </button>
            </div>
          )}

          {/* GLOBAL TRANSACTION SAVE STRIP FOOTER ROW */}
          {categories?.length > 0 && (
            <div className="w-full flex items-center justify-end pt-4">
              <button
                type="button"
                disabled={!isDataChanged || isEditLoading}
                onClick={editCategoriesHandler}
                className={`flex items-center justify-center gap-2 px-6 h-[42px] font-medium text-sm rounded-xl transition-all duration-200 select-none ${
                  isDataChanged && !isEditLoading
                    ? "bg-[#37a39a] hover:bg-[#2d857e] text-white shadow-md shadow-[#37a39a]/10 cursor-pointer"
                    : "bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-slate-600 cursor-not-allowed"
                }`}
              >
                {isEditLoading && (
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                <span>
                  {isEditLoading ? "Saving layout updates..." : "Save Changes"}
                </span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* ⚠️ POPUP MODAL: CATEGORY ROW DELETION CONFIRMATION */}
      {!!deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-[400px] bg-white dark:bg-[#0b0c14] border border-gray-100 dark:border-white/10 rounded-2xl shadow-xl p-6 text-center animate-fadeIn">
            <div className="w-12 h-12 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <AiOutlineDelete size={22} />
            </div>

            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              Remove Category
            </h2>
            <p className="text-sm text-slate-500 dark:text-gray-400 leading-relaxed mb-6">
              Are you sure you want to drop this category? You must click "Save
              Changes" on the main dashboard to synchronize this removal with
              the production database.
            </p>

            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setDeletingId(null)}
                className="w-1/2 h-[40px] text-xs font-medium text-slate-500 dark:text-gray-400 border border-gray-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 rounded-xl transition-all cursor-pointer"
              >
                No, Keep Category
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="w-1/2 h-[40px] bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium rounded-xl transition-all shadow-md shadow-rose-600/10 cursor-pointer"
              >
                Yes, Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditCategories;
