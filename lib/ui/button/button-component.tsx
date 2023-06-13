import React, { Children } from 'react';
import styles from './button.module.css';

type ButtonProps = {
  type?: string;
  children: React.ReactNode;
  onClick?;
  variant?: string;
  disabled?: boolean;
};

export default function ButtonComponent(props: ButtonProps) {
  const { type, children, onClick, variant = 'standard', disabled } = props;

  const variantClass = (() => {
    switch (variant) {
      case 'sidebar':
        return styles.SideBar;
      case 'standard':
        return styles.Standard;
    }
  })();

  return (
    <button onClick={onClick} type="submit" className={variantClass} disabled={disabled}>
      {children}
    </button>
  );
}
