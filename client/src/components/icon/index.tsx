import { createElement } from 'react';
import { type IconBaseProps } from 'react-icons';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';

type TIcon = { name: keyof typeof icons } & IconBaseProps;

const icons = {
  likeEmpty: AiOutlineHeart,
  likeFilled: AiFillHeart,
};

export const Icon: React.FC<TIcon> = ({ name, ...restProps }) => {
  return createElement(icons[name], restProps);
};
