import { motion } from "framer-motion";

const PostSkeleton = () => {
  return (
    <motion.div
      initial={{ opacity: 0.3 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0.3 }}
      transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
      className="bg-gray-800 rounded-xl shadow-md p-4 w-full h-48 flex flex-col justify-between"
    >
      <div className="h-4 bg-gray-700 rounded w-1/4"></div>
      <div className="space-y-3 mt-4">
        <div className="h-3 bg-gray-700 rounded w-3/4"></div>
        <div className="h-3 bg-gray-700 rounded w-5/6"></div>
        <div className="h-3 bg-gray-700 rounded w-2/3"></div>
      </div>
      <div className="flex gap-4 mt-4">
        <div className="h-6 w-12 bg-gray-700 rounded"></div>
        <div className="h-6 w-12 bg-gray-700 rounded"></div>
      </div>
    </motion.div>
  );
};

export default PostSkeleton;
