/** @jsx jsx */
import { jsx } from "@emotion/core";
import * as React from "react";
import * as ReactDOM from "react-dom";
import PropTypes from "prop-types";

export interface PortalProps {
  children: React.ReactNode;
}

let container: Element | null = null;

export const Portal: React.FunctionComponent<PortalProps> = ({ children }) => {
  const [target] = React.useState<HTMLDivElement>(() => {
    if (!container) {
      container = document.createElement("div");
      document.body.appendChild(container);
    }

    const div = document.createElement("div");
    container.appendChild(div);
    return div;
  });

  React.useEffect(() => {
    return () => {
      if (target) {
        container!.removeChild(target);
      }
    };
  }, []);

  return target ? ReactDOM.createPortal(children, target) : null;
};

Portal.propTypes = {
  /** The element to be rendered in the portal */
  children: PropTypes.node
};
