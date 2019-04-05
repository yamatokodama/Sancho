// most of the code is from here:
// https://raw.githubusercontent.com/feathericons/react-feather/master/bin/build.js

const fs = require("fs");
const glob = require("glob");
const camelcase = require("camelcase");
const uppercamelcase = require("uppercamelcase");
const path = require("path");
const cheerio = require("cheerio");
const prettier = require("prettier");

const featherRootDir = path.join(
  __dirname,
  "..",
  "node_modules",
  "feather-icons",
  "dist",
  "icons"
);
const destinationDir = path.join(__dirname, "..", "src", "Icons");

glob(`${featherRootDir}/**.svg`, (err, icons) => {
  fs.writeFileSync(path.join(destinationDir, "index.tsx"), "", "utf-8");

  icons.forEach(i => {
    const svg = fs.readFileSync(i, "utf-8");
    const id = path.basename(i, ".svg");
    const ComponentName = id === "github" ? "GitHub" : uppercamelcase(id);
    const $ = cheerio.load(svg, {
      xmlMode: true
    });
    const fileName = path.basename(i).replace(".svg", "");
    const location = path.join(
      destinationDir,
      "icons",
      "Icon" + uppercamelcase(fileName) + ".tsx"
    );

    $("*").each((index, el) => {
      Object.keys(el.attribs).forEach(x => {
        if (x === "class") {
          $(el).removeAttr("class");
        }

        if (x.includes("-")) {
          $(el)
            .attr(camelcase(x), el.attribs[x])
            .removeAttr(x);
        }
        if (x === "stroke") {
          $(el).attr(x, "currentColor");
        }
      });

      if (el.name === "svg") {
        $(el).attr("otherProps", "...");
      }
    });

    const element = `
      /** @jsx jsx */
      import { jsx, css } from "@emotion/core";
      import * as React from 'react';
      import PropTypes from 'prop-types';
      import { IconProps } from '../IconTypes';
      import { useTheme } from '../../Theme/Providers';

      export const Icon${ComponentName}: React.FunctionComponent<IconProps> = 
        ({ 
          size = 'md', 
          color = 'currentColor', 
          ...otherProps 
        }) 
      => {
        const theme = useTheme()
        const width = typeof size == "string" ? theme.iconSizes[size] : size;
  
        return (
          ${$("svg")
            .toString()
            .replace(new RegExp('stroke="currentColor"', "g"), "stroke={color}")
            .replace('width="24"', "width={width}")
            .replace('height="24"', "height={width}")
            .replace('otherProps="..."', "{...otherProps}")}
        )
      };

      Icon${ComponentName}.propTypes = {
        color: PropTypes.string,
        size: PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.number
        ]),
      }

    `;

    const component = prettier.format(element, {
      trailingComma: "es5",
      bracketSpacing: true,
      parser: "typescript"
    });

    fs.writeFileSync(location, component, "utf-8");

    const exportString = `export * from './icons/Icon${uppercamelcase(
      fileName
    )}';\r\n`;
    fs.appendFileSync(
      path.join(destinationDir, "index.tsx"),
      exportString,
      "utf-8"
    );
  });
});
