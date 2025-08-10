"use client";

import * as React from "react";
import { ThumbsUpIcon } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type LikeButtonProps = React.ComponentProps<typeof Button> & {
  initialLiked?: boolean;
  label?: string;
  onLikeChange?: (isLiked: boolean) => void;
};

const thumbVariants = {
  initial: { scale: 1 },
  liked: { scale: [1, 1.4, 1], transition: { duration: 0.4 } },
  tap: { scale: 0.8 },
};

const LikeButton = React.forwardRef<HTMLButtonElement, LikeButtonProps>(
  (props, ref) => {
    const {
      className,
      initialLiked = false,
      label = "Like",
      onLikeChange,
      ...restProps
    } = props;

    const [liked, setLiked] = React.useState(initialLiked);

    const handleLike = () => {
      const newLiked = !liked;
      setLiked(newLiked);
      if (onLikeChange) {
        onLikeChange(newLiked);
      }
    };

    return (
      <Button
        ref={ref}
        className={cn("py-0 pe-0 overflow-hidden", className)}
        variant="outline"
        onClick={handleLike}
        type="button"
        {...restProps}
      >
        <motion.div
          variants={thumbVariants}
          initial="initial"
          animate={liked ? "liked" : "initial"}
          whileTap="tap"
        >
          <ThumbsUpIcon
            className={cn(
              "transition-all duration-300",
              liked ? "text-blue-500 fill-blue-500" : "opacity-60"
            )}
            size={16}
            aria-hidden="true"
          />
        </motion.div>
        <span className="ml-1.5">{label}</span>
      </Button>
    );
  }
);

LikeButton.displayName = "LikeButton";

export default LikeButton;
