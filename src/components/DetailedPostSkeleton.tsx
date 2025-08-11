import { motion } from "framer-motion";

const DetailedPostSkeleton = () => {
  return (
    <motion.div
      initial={{ opacity: 0.3 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0.3 }}
      transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
      className="bg-gray-800 rounded-xl shadow-md p-6 w-full"
    >
      <div className="h-6 bg-gray-700 rounded w-1/3 mb-4"></div>
      <div className="h-4 bg-gray-700 rounded w-1/2 mb-6"></div>
      <div className="space-y-3 mb-8">
        <div className="h-3 bg-gray-700 rounded w-full"></div>
        <div className="h-3 bg-gray-700 rounded w-5/6"></div>
        <div className="h-3 bg-gray-700 rounded w-4/6"></div>
      </div>
      <div className="h-48 bg-gray-700 rounded"></div>
    </motion.div>
  );
};

export default DetailedPostSkeleton;
