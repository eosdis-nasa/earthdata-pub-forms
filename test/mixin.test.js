import { shallowMount } from "@vue/test-utils";
import mixin from "@/mixins/mixin.js"
import MockComponent from "./MockComponent"

// https://stackoverflow.com/questions/59954101/jest-error-when-setting-or-assigning-window-location
Object.defineProperty(window, 'location', {
  writable: true,
  value: { assign: jest.fn() }
});

// https://www.leighhalliday.com/mock-fetch-jest
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([
              {
                "id": "40397fe8-4841-4e4c-b84a-6ece359ff5ff",
                "long_name": "Atmospheric Science Data Center (ASDC)",
                "url": "https://eosweb.larc.nasa.gov/",
                "short_name": "ASDC",
                "description": "NASA's Atmospheric Science Data Center (ASDC) is in the Science Directorate located at NASA'S Langley Research Center in Hampton, Virginia. The Science Directorate's Climate Science Branch, Atmospheric Composition Branch, and Chemistry and Dynamics Branch work with ASDC to study changes in the Earth and its atmosphere. Data products translate those findings into meaningful knowledge that inspires action by scientists, educators, decision makers, and the public. ASDC supports over 50 projects and provides access to more than 1,000 archived data sets. These data sets were created from satellite measurements, field experiments, and modeled data products. ASDC projects focus on the Earth science discipline Radiation Budget, Clouds, Aerosols, and Tropospheric Composition.",
                "discipline": "SAR Products, Change Detection, Sea Ice, Polar Processes"
              }
            ])
  })
);

describe("Test mounted mixin file", () => {
  let wrapper

  beforeEach(() => {
    fetch.mockClear();

    wrapper = shallowMount(MockComponent, {
      mixins: [mixin],
      data() {
        return {
          selected: "",
          loaded: false,
          daacs:[
            {
              "id": "de6d5ec9-4728-4f2b-9d43-ae2f0fdac96a",
              "long_name": "Land Processes Distributed Active Archive Center (LP DAAC)",
              "url": "https://lpdaac.usgs.gov/",
              "short_name": "LP DAAC",
              "description": "NASA's Land Processes Distributed Active Archive Center (LP DAAC) is located at the U.S. Department of the Interior, U.S. Geological Survey (USGS) Earth Resources Observation and Science (EROS) Center in Sioux Falls, SD. LP DAAC was established in 1990 to process NASA land processes data products and provide vital contributions to inter-disciplinary studies of the integrated Earth system.\nLP DAAC specializes in:\nProcessing, archiving, and distributing Advanced Spaceborne Thermal Emission and Reflection Radiometer (ASTER) from Terra;\nArchiving and distributing Moderate-resolution Imaging Spectroradiometer (MODIS) from Terra and Aqua;\nArchiving and distributing NASA Visible Infrared Imaging Radiometer Suite (VIIRS) data from the joint NASA/NOAA Suomi National Polar-orbiting Partnership (Suomi NPP) satellite;\nArchiving and distributing ECOsystem Spaceborne Thermal Radiometer Experiment on Space Station (ECOSTRESS) data from the International Space Station.\nArchiving and distributing Global Ecosystem Dynamics Investigation (GEDI) data from the International Space Station.\nDistributing NASA Making Earth System Data\nRecords for Use in Research Environments (MEaSUREs) Collaborations:\nGlobal Forest Cover Change  (GFCC)\nGlobal Food Security-support Analysis Data  (GFSAD)\nGlobal Web-Enabled Landsat Data  (GWELD)\nLand Surface Temperature and Emissivity  (LSTE)\nNASA Digital Elevation Model (DEM)  (NASADEM)\nShuttle Radar Topography Mission  (SRTM)\nVegetation Continuous Fields  (VCF)\nVegetation Index and Phenology  (VIP)\nDistributing approved data products created by researchers, collectively known as Community:\nAirborne Hyperspectral Reflectance Mosaic\nASTER Global Emissivity Database  (GED)\nGlobal Hyperspectral Imaging Spectral-library of Agricultural crops  (GHISA)\nHeadwall Hyperspectral Reflectance Mosaic\nProviding tools and services for discovery and analysis of NASA's land cover and land use data.",
              "discipline": "Land data products"
            },
            {
              "id": "aec3724f-b30b-4b3f-9b9a-e0907d9d14b3",
              "long_name": "National Snow and Ice Data Center (NSIDC) Distributed Active Archive Center (DAAC)",
              "url": "http://nsidc.org/daac/",
              "short_name": "NSIDC DAAC",
              "description": "NASA's National Snow and Ice Data Center (NSIDC) Distributed Active Archive Center (DAAC) provides data and information for snow and ice processes, particularly interactions among snow, ice, atmosphere, and ocean, in support of research in global change detection and model validation.\nNSIDC DAAC archives and distributes cryosphere and climate related products from several EOS sensors including:\n Advanced Microwave Scanning Radiometer - EOS  (AMSR-E)\nAMSR2\nAquarius Airborne Snow Observatory  (ASO)\nCold Land Processes Field Experiment  (CLPX)\nGlobal Land Ice Measurements  (GLIMS)\nIceBridge ICESat/Geoscience Laser Altimeter System  (GLAS)\nIce, Cloud, and land Elevation Satellite-2  (ICESat-2)\nModerate Resolution Imaging Spectroradiometer  (MODIS)\nSoil Moisture Active Passive  (SMAP)\nScanning Multichannel Microwave Radiometer  (SMMR)\nSpecial Sensor Microwave Imager  (SSM/I)\nSpecial Sensor Microwave Imager/Sounder  (SSMIS)\nSnow Experiment  (SnowEX)\nVisible Infrared Imaging Radiometer Suite  (VIIRS)\nNSIDC DAAC also provides general data and information services to the cryospheric and polar processes research community. NSIDC DAAC is located in Boulder, CO. NSIDC DAAC has served at the forefront of cryospheric data management practices since 1976. NSIDC DAAC is part of the Cooperative Institute for Research in Environmental Sciences (CIRES), a joint institute of University of Colorado Boulder and the National Oceanic and Atmospheric Administration.\n",
              "discipline": "Cryospheric Processes, Sea Ice, Snow, Ice Sheets, Frozen Ground, Glaciers, Soil Moisture"
            },
          ],
          formId: '',
          requestId: ''
        };
      }
    });
  });

  // Testing titleCase function
  it("should return a titlecased string", () => {
      expect(wrapper.vm.titleCase("edpub is awesome")).toBe("Edpub Is Awesome")
  })

  it("should return undefined", () => {
      expect(wrapper.vm.titleCase()).toBe("undefined")
  })

  //Testing fetchDaacs function
  it("should return an array containing info about the daacs", async () => {
    // Default setup has 2 daacs
    expect(wrapper.vm.daacs).toHaveLength(2)

    const data = await wrapper.vm.fetchDaacs();

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(data).toBeInstanceOf(Array)
    expect(data).toHaveLength(1)

    // Verify that it overrode the daacs object with the single entry returned by fetch
    expect(wrapper.vm.daacs).toHaveLength(1)

  });

  // Testing getDaac function
  it("should return an object with no values", () => {
    expect(wrapper.vm.getDaac()).toMatchObject({
      "id": "",
      "long_name": "",
      "url": "",
      "short_name": "",
      "description": ""
    });
  })

  it("should return the NSIDS DAAC object", () => {
    expect(wrapper.vm.getDaac("NSIDC DAAC")).toMatchObject({
      "id": "aec3724f-b30b-4b3f-9b9a-e0907d9d14b3",
      "long_name": "National Snow and Ice Data Center (NSIDC) Distributed Active Archive Center (DAAC)",
      "url": "http://nsidc.org/daac/",
      "short_name": "NSIDC DAAC",
      "description": "NASA's National Snow and Ice Data Center (NSIDC) Distributed Active Archive Center (DAAC) provides data and information for snow and ice processes, particularly interactions among snow, ice, atmosphere, and ocean, in support of research in global change detection and model validation.\nNSIDC DAAC archives and distributes cryosphere and climate related products from several EOS sensors including:\n Advanced Microwave Scanning Radiometer - EOS  (AMSR-E)\nAMSR2\nAquarius Airborne Snow Observatory  (ASO)\nCold Land Processes Field Experiment  (CLPX)\nGlobal Land Ice Measurements  (GLIMS)\nIceBridge ICESat/Geoscience Laser Altimeter System  (GLAS)\nIce, Cloud, and land Elevation Satellite-2  (ICESat-2)\nModerate Resolution Imaging Spectroradiometer  (MODIS)\nSoil Moisture Active Passive  (SMAP)\nScanning Multichannel Microwave Radiometer  (SMMR)\nSpecial Sensor Microwave Imager  (SSM/I)\nSpecial Sensor Microwave Imager/Sounder  (SSMIS)\nSnow Experiment  (SnowEX)\nVisible Infrared Imaging Radiometer Suite  (VIIRS)\nNSIDC DAAC also provides general data and information services to the cryospheric and polar processes research community. NSIDC DAAC is located in Boulder, CO. NSIDC DAAC has served at the forefront of cryospheric data management practices since 1976. NSIDC DAAC is part of the Cooperative Institute for Research in Environmental Sciences (CIRES), a joint institute of University of Colorado Boulder and the National Oceanic and Atmospheric Administration.\n",
    });
  })

})