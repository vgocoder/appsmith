import React from "react";

import Dropdown, {
  DropdownOption,
  RenderOption,
} from "components/ads/Dropdown";
import { AppTheme } from "entities/AppTheming";

interface ThemeFontControlProps {
  theme: AppTheme;
  sectionName: string;
  options: string[];
  selectedOption: string;
  updateTheme: (theme: AppTheme) => void;
}

function ThemeFontControl(props: ThemeFontControlProps) {
  const { options, sectionName, selectedOption, theme, updateTheme } = props;

  /**
   * renders dropdown option
   *
   * @param param0
   * @returns
   */
  const renderOption: RenderOption = ({ isSelectedNode, option }) => (
    <div
      className={`flex  space-x-2 w-full px-2 py-2 ${
        isSelectedNode ? "bg-gray-100" : " hover:bg-gray-100 cursor-pointer"
      }`}
      onClick={() => {
        if (!isSelectedNode) {
          updateTheme({
            ...theme,
            properties: {
              ...theme.properties,
              fontFamily: {
                ...theme.properties.fontFamily,
                [sectionName]:
                  (option as DropdownOption).value || selectedOption,
              },
            },
          });
        }
      }}
    >
      <div className="flex items-center justify-center w-6 h-6 bg-white border">
        Aa
      </div>
      <div className="leading-normal">{(option as DropdownOption).label}</div>
    </div>
  );

  return (
    <section className="space-y-2">
      <Dropdown
        className="px-0"
        options={options.map((option) => ({
          value: option,
          label: option,
        }))}
        renderOption={renderOption}
        selected={{
          label: selectedOption,
          value: selectedOption,
        }}
        showLabelOnly
        width="100%"
      />
    </section>
  );
}

export default ThemeFontControl;