import { createElement } from 'react';
import { type IconBaseProps } from 'react-icons';
import { AiFillCloseCircle, AiFillHeart, AiOutlineHeart } from 'react-icons/ai';

type TIcon = { name: keyof typeof icons } & IconBaseProps;

const icons = {
  likeEmpty: AiOutlineHeart,
  likeFilled: AiFillHeart,
  delete: AiFillCloseCircle,
};

export const Icon: React.FC<TIcon> = ({ name, ...restProps }) => {
  return createElement(icons[name], restProps);
};
