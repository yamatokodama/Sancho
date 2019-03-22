/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import * as React from "react";
import { useTransition, animated, config } from "react-spring";
import theme from "./Theme";
import { useFocusElement } from "./Hooks/focus";
import { Overlay } from "./Overlay";

import PropTypes from "prop-types";
import { RemoveScroll } from "react-remove-scroll";

export const RequestCloseContext = React.createContext(() => {});

function getTransitionForPosition(position: SheetPositions) {
  switch (position) {
    case "left":
      return {
        from: { transform: `translate3d(-100%, 0, 0)` },
        enter: { transform: `translate3d(0, 0, 0)` },
        leave: { transform: `translate3d(-100%, 0, 0)` },
        config: { mass: 1, tension: 185, friction: 26 }
      };
    case "right":
      return {
        from: { transform: `translate3d(100%, 0, 0)` },
        enter: { transform: `translate3d(0, 0, 0)` },
        leave: { transform: `translate3d(100%, 0, 0)` },
        config: { mass: 1, tension: 185, friction: 26 }
      };
    case "top":
      return {
        from: { transform: `translateY(-100%)` },
        enter: { transform: `translateY(0)` },
        leave: { transform: `translateY(-100%)` },
        config: { mass: 1, tension: 185, friction: 26 }
      };
    case "bottom":
      return {
        from: { transform: `translateY(100%)` },
        enter: { transform: `translateY(0)` },
        leave: { transform: `translateY(100%)` },
        config: { mass: 1, tension: 185, friction: 26 }
      };
  }
}

const positions = {
  left: css({
    top: 0,
    left: 0,
    bottom: 0,
    width: "auto",
    maxWidth: "100vw",
    [theme.breakpoints.md]: {
      maxWidth: "400px"
    }
  }),
  right: css({
    top: 0,
    right: 0,
    bottom: 0,
    width: "auto",
    maxWidth: "100vw",
    [theme.breakpoints.md]: {
      maxWidth: "400px"
    }
  }),
  bottom: css({
    bottom: 0,
    left: 0,
    right: 0,
    height: "auto",
    width: "100%",
    padding: 0,
    boxSizing: "border-box",
    [theme.breakpoints.md]: {
      maxHeight: "400px"
    },
    "& > div": {
      borderTopRightRadius: theme.radii.lg,
      borderTopLeftRadius: theme.radii.lg,
      paddingBottom: theme.spaces.md,
      paddingTop: theme.spaces.xs
    }
  }),
  top: css({
    top: 0,
    left: 0,
    right: 0,
    height: "auto",
    width: "100%",
    padding: 0,
    [theme.breakpoints.md]: {
      maxHeight: "400px"
    },
    "& > div": {
      borderBottomRightRadius: theme.radii.lg,
      borderBottomLeftRadius: theme.radii.lg,
      paddingBottom: theme.spaces.xs,
      paddingTop: theme.spaces.md
    }
  })
};

const noop = () => {};

export type SheetPositions = keyof typeof positions;

interface SheetProps {
  isOpen: boolean;
  onRequestClose: () => void;
  role?: string;
  children: React.ReactNode;
  position: SheetPositions;
  closeOnClick?: boolean;
}

export const Sheet: React.FunctionComponent<SheetProps> = ({
  isOpen,
  children,
  role = "document",
  closeOnClick = true,
  position = "right",
  onRequestClose,
  ...props
}) => {
  const { bind: bindFocus } = useFocusElement(isOpen);

  const transitions = useTransition(
    isOpen,
    null,
    getTransitionForPosition(position)
  );

  return (
    <React.Fragment>
      <Overlay
        isOpen={isOpen}
        onRequestClose={closeOnClick ? onRequestClose : noop}
      >
        <React.Fragment>
          {transitions.map(({ item, key, props: animationProps, ...other }) => {
            return (
              item && (
                <animated.div
                  key={key}
                  role={role}
                  {...bindFocus}
                  tabIndex={-1}
                  className="Sheet"
                  onClick={e => {
                    e.stopPropagation();
                  }}
                  style={{
                    transform: animationProps.transform
                  }}
                  css={[
                    {
                      outline: "none",
                      zIndex: theme.zIndex.modal,
                      opacity: 1,
                      position: "fixed"
                    },
                    positions[position]
                  ]}
                  {...other}
                  {...props}
                >
                  <RequestCloseContext.Provider value={onRequestClose}>
                    <RemoveScroll forwardProps>
                      <div
                        className="Sheet__container"
                        css={{ background: "white", height: "100%" }}
                      >
                        {children}
                      </div>
                    </RemoveScroll>
                  </RequestCloseContext.Provider>
                </animated.div>
              )
            );
          })}
        </React.Fragment>
      </Overlay>
    </React.Fragment>
  );
};

Sheet.propTypes = {
  isOpen: PropTypes.bool,
  onRequestClose: PropTypes.func,
  children: PropTypes.node,
  position: PropTypes.oneOf(["left", "top", "right", "bottom"]),
  closeOnClick: PropTypes.bool
};
