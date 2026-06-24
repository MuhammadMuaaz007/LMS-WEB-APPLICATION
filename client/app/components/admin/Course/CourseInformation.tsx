"use client"

import { useState, type FC } from "react"

type Props = {
  courseInfo: any
  setCourseInfo: (courseInfo: any) => void
  active: number
  setActive: (active: number) => void
}

const CourseInformation: FC<Props> = ({ courseInfo, setCourseInfo, active, setActive }) => {

  const categories: any[] = []; 
  
  const [dragging, setDragging] = useState(false)

  const handleSubmit = (e: any) => {
    e.preventDefault()
    setActive(active + 1)
  }


  const handleFileChange = (e: any) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setCourseInfo({ ...courseInfo, thumbnail: reader.result })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDragOver = (e: any) => {
    e.preventDefault()
    setDragging(true)
  }

  const handleDragLeave = (e: any) => {
    e.preventDefault()
    setDragging(false)
  }

  const handleDrop = (e: any) => {
    e.preventDefault()
    setDragging(false)

    const file = e.dataTransfer.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setCourseInfo({ ...courseInfo, thumbnail: reader.result })
      }
      reader.readAsDataURL(file)
    }
  }

  const inputTheme = "w-full mt-2 px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all duration-200"
  const labelTheme = "text-sm font-medium text-slate-700 dark:text-slate-300"

  return (
    <div className="max-w-4xl mx-auto my-12 px-4">
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Course Name */}
        <div>
          <label htmlFor="name" className={labelTheme}>
            Course Name
          </label>
          <input
            type="text"
            required
            value={courseInfo.name || ""}
            onChange={(e: any) => setCourseInfo({ ...courseInfo, name: e.target.value })}
            id="name"
            placeholder="MERN stack LMS platform with Next.js"
            className={inputTheme}
          />
        </div>

        {/* Course Description */}
        <div>
          <label htmlFor="description" className={labelTheme}>
            Course Description
          </label>
          <textarea
            id="description"
            rows={5}
            placeholder="Write an amazing description for your course..."
            className={`${inputTheme} resize-none`}
            value={courseInfo.description || ""}
            onChange={(e: any) => setCourseInfo({ ...courseInfo, description: e.target.value })}
          />
        </div>

        {/* Price & Estimated Price */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="price" className={labelTheme}>
              Course Price ($)
            </label>
            <input
              type="number"
              required
              value={courseInfo.price || ""}
              onChange={(e: any) => setCourseInfo({ ...courseInfo, price: e.target.value })}
              id="price"
              placeholder="29"
              className={inputTheme}
            />
          </div>
          <div>
            <label htmlFor="estimatedPrice" className={labelTheme}>
              Estimated Price <span className="text-xs text-slate-400">(Optional)</span>
            </label>
            <input
              type="number"
              value={courseInfo.estimatedPrice || ""}
              onChange={(e: any) => setCourseInfo({ ...courseInfo, estimatedPrice: e.target.value })}
              id="estimatedPrice"
              placeholder="79"
              className={inputTheme}
            />
          </div>
        </div>

        {/* Tags & Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="tags" className={labelTheme}>
              Course Tags
            </label>
            <input
              type="text"
              required
              value={courseInfo.tags || ""}
              onChange={(e: any) => setCourseInfo({ ...courseInfo, tags: e.target.value })}
              id="tags"
              placeholder="MERN, NextJS, Tailwind, LMS"
              className={inputTheme}
            />
          </div>
          <div>
            <label htmlFor="category" className={labelTheme}>
              Course Category
            </label>
            <select
              id="category"
              className={`${inputTheme} appearance-none cursor-pointer`}
              value={courseInfo.category || ""}
              onChange={(e: any) => setCourseInfo({ ...courseInfo, category: e.target.value })}
            >
              <option className="bg-white dark:bg-slate-800" value="">
                Select Category
              </option>
              {categories &&
                categories.map((item: any) => (
                  <option className="bg-white dark:bg-slate-800" value={item.title} key={item.title}>
                    {item.title}
                  </option>
                ))}
            </select>
          </div>
        </div>

        {/* Level & Demo URL */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="level" className={labelTheme}>
              Course Level
            </label>
            <input
              type="text"
              value={courseInfo.level || ""}
              required
              onChange={(e: any) => setCourseInfo({ ...courseInfo, level: e.target.value })}
              id="level"
              placeholder="Beginner / Intermediate / Expert"
              className={inputTheme}
            />
          </div>
          <div>
            <label htmlFor="demoUrl" className={labelTheme}>
              Demo URL
            </label>
            <input
              type="text"
              required
              value={courseInfo.demoUrl || ""}
              onChange={(e: any) => setCourseInfo({ ...courseInfo, demoUrl: e.target.value })}
              id="demoUrl"
              placeholder="https://youtube.com/demo..."
              className={inputTheme}
            />
          </div>
        </div>

        {/* Thumbnail Upload Area */}
        <div>
          <label className={labelTheme}>Course Thumbnail</label>
          <div className="mt-2">
            {/* Added handleFileChange here */}
            <input 
              type="file" 
              accept="image/*" 
              id="file" 
              className="hidden" 
              onChange={handleFileChange} 
            />
            <label
              htmlFor="file"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`group flex flex-col items-center justify-center w-full min-h-[200px] border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all duration-200 ${
                dragging 
                  ? "border-teal-500 bg-teal-50/50 dark:bg-teal-900/20" 
                  : "border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/20 hover:border-teal-500 dark:hover:border-teal-400 hover:bg-slate-50 dark:hover:bg-slate-800/50"
              }`}
            >
              {courseInfo.thumbnail ? (
                <div className="w-full relative rounded-lg overflow-hidden max-h-[300px]">
                  <img
                    src={courseInfo.thumbnail}
                    alt="Preview"
                    className="w-full h-full object-contain max-h-[280px]"
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <svg className="mx-auto h-12 w-12 text-slate-400 group-hover:text-teal-500 transition-colors" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4-4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    <span className="font-semibold text-teal-600 dark:text-teal-400">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-slate-400">PNG, JPG, WEBP up to 5MB</p>
                </div>
              )}
            </label>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="w-full sm:w-[160px] h-[46px] bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg shadow-sm shadow-teal-600/20 active:scale-[0.98] transition-all duration-150 cursor-pointer"
          >
            Next Step
          </button>
        </div>
      </form>
    </div>
  )
}

export default CourseInformation