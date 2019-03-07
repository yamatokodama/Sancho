/** @jsx jsx */
import { jsx } from "@emotion/core";
import * as React from "react";
import theme from "./Theme";
import { Text } from "./Text";
import PropTypes from "prop-types";

interface BreadcrumbProps extends React.OlHTMLAttributes<HTMLOListElement> {
  children: React.ReactElement<BreadcrumbItemProps>[];
}

export const Breadcrumb: React.FunctionComponent<BreadcrumbProps> = ({
  children
}) => {
  return (
    <nav
      aria-label="breadcrumb"
      css={{
        maxWidth: "100%",
        overflow: "hidden"
      }}
    >
      <ol
        css={{
          listStyle: "none",
          whiteSpace: "nowrap",
          display: "inline-flex",
          boxSizing: "border-box",
          overflow: "hidden",
          width: "100%",
          margin: 0,
          padding: `${theme.spaces.sm} ${theme.spaces.md}`,
          background: theme.colors.background.tint1,
          borderRadius: theme.radii.sm
        }}
      >
        {React.Children.map(children, (child, i) => {
          return React.cloneElement(child as any, {
            "aria-current":
              i === React.Children.count(children) - 1 ? "page" : undefined
          });
        })}
      </ol>
    </nav>
  );
};

Breadcrumb.propTypes = {
  children: PropTypes.element as any
};

interface BreadcrumbItemProps extends React.LiHTMLAttributes<HTMLLIElement> {}

export const BreadcrumbItem: React.FunctionComponent<BreadcrumbItemProps> = ({
  children,
  ...other
}) => {
  const current = other["aria-current"];
  return (
    <li
      css={{
        flex: "1 1 auto",
        overflow: "hidden",
        display: "flex",
        alignItems: "center"
      }}
      {...other}
    >
      <Text wrap={false} component="div" variant="body">
        {children}
      </Text>
      {!current && <BreadCrumbDivider />}
    </li>
  );
};

BreadcrumbItem.propTypes = {
  children: PropTypes.node
};

const BreadCrumbDivider: React.FunctionComponent<{ inverted?: boolean }> = ({
  inverted = false
}) => (
  <div
    aria-hidden
    css={{
      flex: "0 0 auto",
      margin: `0 ${theme.spaces.sm}`,
      color: !inverted ? theme.colors.text.muted : "white"
    }}
  >
    <svg
      css={{ marginTop: "2px" }}
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="feather feather-chevron-right"
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  </div>
);

BreadCrumbDivider.propTypes = {
  inverted: PropTypes.bool
};
