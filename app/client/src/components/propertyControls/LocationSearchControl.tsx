import React, { useState } from "react";
import BaseControl, { ControlProps } from "./BaseControl";
import SearchBox from "react-google-maps/lib/components/places/SearchBox";
import StandaloneSearchBox from "react-google-maps/lib/components/places/StandaloneSearchBox";
import { getAppsmithConfigs } from "@appsmith/configs";
import { useScript, ScriptStatus, AddScriptTo } from "utils/hooks/useScript";
import { StyledInputGroup } from "./StyledControls";
import log from "loglevel";

const { google } = getAppsmithConfigs();

class LocationSearchControl extends BaseControl<ControlProps> {
  searchBox: any = null;

  clearLocation = () => {
    this.updateProperty(this.props.propertyName, {
      lat: -34.397,
      long: 150.644,
      title: "",
    });
  };

  onLocationSelection = () => {
    try {
      // For some places, the length is zero
      const places = this.searchBox.getPlaces();
      const location = places[0].geometry.location;
      const title = places[0].formatted_address;
      const lat = location.lat();
      const long = location.lng();
      const value = { lat, long, title };
      this.updateProperty(this.props.propertyName, value);
    } catch (e) {
      if (this.searchBox && this.searchBox.getPlaces)
        log.debug("Error selecting location:", this.searchBox.getPlaces());
      else {
        log.debug("Error selecting location - searchBox not found");
      }
    }
  };

  onSearchBoxMounted = (ref: SearchBox) => {
    this.searchBox = ref;
  };

  render() {
    return (
      <MapScriptWrapper
        clearLocation={this.clearLocation}
        onPlacesChanged={this.onLocationSelection}
        onSearchBoxMounted={this.onSearchBoxMounted}
        propertyValue={this.props.propertyValue}
      />
    );
  }

  static getControlType() {
    return "LOCATION_SEARCH";
  }
}

interface MapScriptWrapperProps {
  onSearchBoxMounted: (ref: SearchBox) => void;
  onPlacesChanged: () => void;
  clearLocation: () => void;
  propertyValue: any;
}

function MapScriptWrapper(props: MapScriptWrapperProps) {
  const status = useScript(
    `https://maps.googleapis.com/maps/api/js?key=${google.apiKey}&v=3.exp&libraries=geometry,drawing,places`,
    AddScriptTo.HEAD,
  );
  const [title, setTitle] = useState("");

  return (
    <div data-standalone-searchbox="">
      {status === ScriptStatus.READY && (
        <StandaloneSearchBox
          onPlacesChanged={() => {
            props.onPlacesChanged();
            setTitle("");
          }}
          ref={props.onSearchBoxMounted}
        >
          <StyledInputGroup
            dataType="text"
            defaultValue={title || props.propertyValue?.title}
            onChange={(value: string) => {
              if (value === "") {
                props.clearLocation();
              }
              setTitle(value);
            }}
            placeholder="Enter location"
            tabIndex={-1}
          />
        </StandaloneSearchBox>
      )}
    </div>
  );
}

export default LocationSearchControl;
