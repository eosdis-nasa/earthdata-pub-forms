import { createLocalVue, mount } from "@vue/test-utils"
import Vuex from "vuex"
import flushPromises from 'flush-promises'
import { store } from "@/store"
import FormsDaacs from "@/components/FormsDaacs";
import { BootstrapVue, BootstrapVueIcons, IconsPlugin } from 'bootstrap-vue'

Object.defineProperty(window, "headerComponent", {
  value: {
     daac: undefined
  },
  writable: true
});


global.fetch = jest.fn(() =>
  Promise.resolve({
    ok:true,
    json: () => Promise.resolve(
      [
        {
          "id": "40397fe8-4841-4e4c-b84a-6ece359ff5ff",
          "long_name": "Atmospheric Science Data Center (ASDC)",
          "url": "https://eosweb.larc.nasa.gov/",
          "short_name": "ASDC",
          "description": "NASA's Atmospheric Science Data Center (ASDC) is in the Science Directorate located at NASA'S Langley Research Center in Hampton, Virginia. The Science Directorate's Climate Science Branch, Atmospheric Composition Branch, and Chemistry and Dynamics Branch work with ASDC to study changes in the Earth and its atmosphere. Data products translate those findings into meaningful knowledge that inspires action by scientists, educators, decision makers, and the public. ASDC supports over 50 projects and provides access to more than 1,000 archived data sets. These data sets were created from satellite measurements, field experiments, and modeled data products. ASDC projects focus on the Earth science discipline Radiation Budget, Clouds, Aerosols, and Tropospheric Composition.",
          "discipline": "SAR Products, Change Detection, Sea Ice, Polar Processes"
        },
        {
          "id": "c606afba-725b-4ae4-9557-1fd33260ae12",
          "long_name": "Alaska Satellite Facility (ASF) Distributed Active Archive Center (DAAC)",
          "url": "https://www.asf.alaska.edu/?_ga=2.11078268.912458096.1583768373-843631388.1568298089",
          "short_name": "ASF DAAC",
          "description": "NASA's Alaska Satellite Facility Distributed Active Archive Center (ASF DAAC) is located in the Geophysical Institute at the University of Alaska, Fairbanks. ASF DAAC is supported by NASA to acquire, process, archive, and distribute synthetic aperture radar (SAR) data from polar-orbiting satellite and airborne sensors to advance Earth science research. Most of the datasets at ASF DAAC, including Copernicus Sentinel-1, are open access and freely available to the public for download.",
          "discipline": "Radiation Budget, Clouds, Aerosols, Tropospheric Composition"
        },
        {
          "id": "d551380f-8813-40e4-9763-2a5bb6007cd0",
          "long_name": "Crustal Dynamics Data Information System (CDDIS)",
          "url": "http://cddis.gsfc.nasa.gov/",
          "short_name": "CDDIS",
          "description": "NASA's Crustal Dynamics Data Information System (CDDIS) is NASA’s data archive and information service supporting the international space geodesy community. CDDIS is part of the Solar System Exploration Division at NASA's Goddard Space Flight Center in Greenbelt, MD. CDDIS serves as one of the core components for the geometric services established under the International Association of Geodesy (IAG), an organization that promotes scientific cooperation and research in geodesy on a global scale. CDDIS provides continuous, long term, public access to the data and derived products from a global network of observing stations equipped with one or more of the following measurement techniques: Global Navigation Satellite System (GNSS),Satellite Laser Ranging (SLR),Lunar Laser Ranging (LLR),Very Long Baseline Interferometry (VLBI), andDoppler Orbitography and Radiopositioning Integrated by Satellite (DORIS)",
          "discipline": "Space Geodesy, Solid Earth"
        },
        {
          "id": "1ea1da68-cb95-431f-8dd8-a2cf16d7ef98",
          "long_name": "Goddard Earth Sciences Data and Information Services Center (GES DISC)",
          "url": "https://disc.gsfc.nasa.gov/",
          "short_name": "GES DISC",
          "description": "NASA's Goddard Earth Sciences Data and Information Services Center (GES DISC) is located within NASA's Goddard Space Flight Center in Greenbelt, Maryland. It provides access to a wide range of global climate data, concentrated primarily in the areas of atmospheric composition, atmospheric dynamics, global precipitation, and solar irradiance. GES DISC supports data from many heritage and EOS missions including Aqua, Aura, Solar Radiation and Climate Experiment (SORCE), Tropical Rainfall Measuring Mission (TRMM), Upper Atmosphere Research Satellite (UARS), and Earth Probe/Total Ozone Mapping Spectrometers (TOMS). GES DISC also provides data subsetting, exploration, visualization, and access services.",
          "discipline": "Global Precipitation, Solar Irradiance, Atmospheric Composition and Dynamics, Water and Energy"
        },
        {
          "id": "ef229725-1cad-485e-a72b-a276d2ca3175",
          "long_name": "Global Hydrology Resource Center (GHRC) Distributed Active Archive Center (DAAC)",
          "url": "https://ghrc.nsstc.nasa.gov/home/",
          "short_name": "GHRC DAAC",
          "description": "NASA's Global Hydrology Resource Center (GHRC) Distributed Active Archive Center (DAAC) is a joint venture of NASA's Marshall Space Flight Center and the Information Technology and Systems Center (ITSC) located within the University of Alabama in Huntsville. GHRC DAAC was established in 1991 and is located at the National Space Science and Technology Center on the UAH campus.\nGHRC DAAC provides a comprehensive active archive of both data and knowledge augmentation services, with a focus on hazardous weather, its governing dynamical and physical processes, and associated applications.\nWith this broad mandate, GHRC DAAC focuses on lightning, tropical cyclones and storm-induced hazards through integrated collections of satellite, airborne, and in-situ data sets.",
          "discipline": "Lightning, Severe Weather Interactions, Atmospheric Convection, Hurricanes, Storm-induced Hazards"
        },
        {
          "id": "9e0628f1-0dde-4ed2-b1e3-690c70326f25",
          "long_name": "Level 1 Atmosphere Archive and Distribution System (LAADS) Distributed Active Archive Center (DAAC)",
          "url": "https://ladsweb.modaps.eosdis.nasa.gov/",
          "short_name": "LAADS DAAC",
          "description": "NASA's Level-1 and Atmosphere Archive and Distribution System (LAADS) Distributed Active Archive Center (DAAC) is part of the Terrestrial Information Systems Laboratory at NASA's Goddard Space Flight Center in Greenbelt, MD. It is collocated with the MODIS Adaptive Processing System (MODAPS). LAADS DAAC joined the EOSDIS DAACs in 2007.\nLAADS DAAC provides access to MODIS Level 1 data (geolocation, L1A, and radiance L1B) and Atmosphere (Level 2 and 3) data products. LAADS DAAC receives data processed by MODAPS and archives and distributes MODIS products from both the Terra and Aqua platforms: Level-1 products (calibrated radiances and geolocation) and Level-2 and -3. MODAPS supports MODIS data from both the Terra and Aqua platforms. Products may be subset by parameter, area, or band, and may be mosaicked, reprojected, or masked. Users may also visually browse MODIS level 1 and atmosphere data products.",
          "discipline": "MODIS (Moderate Resolution Imaging Spectrometer) Level 1 data (geolocation, L1A, and radiance L1B) and Atmosphere (Level 2 and Level 3)"
        },
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
        {
          "id": "fe75c306-ac04-4689-a702-073d9cb071fe",
          "long_name": "Ocean Biology Distributed Active Archive Center (OB.DAAC)",
          "url": "https://oceancolor.gsfc.nasa.gov/",
          "short_name": "OB.DAAC",
          "description": "NASA's Ocean Biology Distributed Active Archive Center (OB.DAAC) is managed by NASA's Ocean Biology Processing Group (OBPG). OB.DAAC is responsible for archiving satellite ocean biology data produced or collected under NASA’s Earth Observing System Data and Information System (EOSDIS). OB.DAAC's holdings include a mixture of historical and current missions, as well as data from both NASA and partner space organizations. Supported sensors, related information, and direct links to data can be found on the OB.DAAC website.",
          "discipline": "Ocean Biology"
        },
        {
          "id": "15df4fda-ed0d-417f-9124-558fb5e5b561",
          "long_name": "Oak Ridge National Laboratory (ORNL) Distributed Active Archive Center (DAAC)",
          "url": "http://daac.ornl.gov/",
          "short_name": "ORNL DAAC",
          "description": "NASA's Oak Ridge National Laboratory (ORNL) Distributed Active Archive Center (DAAC) is located at the Oak Ridge National Laboratory in Oak Ridge, Tennessee. ORNL DAAC was established in 1993 and is under an interagency agreement between NASA and the Department of Energy.\nORNL DAAC specializes on data and information relevant to terrestrial biogeochemistry, ecology, and environmental processes, which are critical to understanding the dynamics of Earth's biological, geological, and chemical components.",
          "discipline": "Biogeochemical Dynamics, Ecological Data, Environmental Processes"
        },
        {
          "id": "6b3ea184-57c5-4fc5-a91b-e49708f91b67",
          "long_name": "Physical Oceanography Distributed Active Archive Center (PO.DAAC)",
          "url": "http://podaac.jpl.nasa.gov/",
          "short_name": "PO.DAAC",
          "description": "NASA's Physical Oceanography Distributed Active Archive Center (PO.DAAC) is located at NASA's Jet Propulsion Laboratory in Pasadena, California. PO.DAAC manages and provides tools and services for NASA's oceanographic and hydrologic data (satellite, airborne, and in-situ) to enable greater understanding of the physical processes and condition of the global ocean. Measurements include gravity, ocean winds, sea surface temperature, ocean surface topography, sea surface salinity, ocean currents, and circulation. The data support a wide range of applications including climate research, weather prediction, resource management, policy, and the stewardship of ocean data resources.\nSample data holdings include Aquarius, Soil Moisture Active Passive (SMAP), Gravity Recovery and Climate Experiment(GRACE), GRACE Follow-on (GRACE-FO), NASA Scatterometer (NSCAT), Quick Scatterometer (QuikSCAT), Rapid Scatterometer (RapidScat), Cyclone Global Navigation Satellite System (CYGNSS), TOPEX/POSEIDON, Jason-1, Group for High Resolution Sea Surface Temperature (GHRSST), Oceans Melting Greenland (OMG), Salinity Processes in the Upper Ocean Regional Study (SPURS), and Making Earth System Data Records for Use in Research Environments (MEaSUREs).\nData access services include PO.DAAC Drive, Thematic Real-time Environmental Distributed Data Services (THREDDS), Open-source Project for a Network Data Access Protocol (OPeNDAP), PO.DAAC Web Services, and PO.DAAC GitHub repository.\nTools that provide subsetting, extraction, and visualization capabilities include High-level Tool for Interactive Data Extraction (HiTIDE), Live Access Server (LAS), and State of the Ocean (SOTO).",
          "discipline": "Gravity, Ocean Circulation, Ocean Heat Budget, Ocean Surface Topography, Ocean Temperature, Ocean Waves, Ocean Winds, Ocean Salinity, Surface Water"
        },
        {
          "id": "00dcf32a-a4e2-4e55-a0d1-3a74cf100ca1",
          "long_name": "Socioeconomic Data and Applications Data Center (SEDAC)",
          "url": "http://sedac.ciesin.columbia.edu/",
          "short_name": "SEDAC",
          "description": "NASA's Socioeconomic Data and Applications Center (SEDAC) is operated by the Center for International Earth Science Information Network (CIESIN), a unit of the Earth Institute at Columbia University based at the Lamont-Doherty Earth Observatory in Palisades, New York.\nSEDAC’s missions are to synthesize Earth science and socioeconomic data and information in ways useful to a wide range of decision makers and other applied users, and to provide an “Information Gateway” between the socioeconomic and Earth science data and information domains.\nSEDAC datasets can be accessed via the dataset section of the SEDAC web site.",
          "discipline": "Synthesized Earth science and socio-economic data",
          "hidden": true
        }
      ]
    ),
  }),
)

describe('FormsDaacs', () => {
  const localVue = createLocalVue()

  localVue.use(Vuex)
  localVue.use(BootstrapVue)
  // Optionally install the BootstrapVue icon components plugin
  localVue.use(BootstrapVueIcons)
  // Optionally install the BootstrapVue icon components plugin
  localVue.use(IconsPlugin)

  let wrapper


  beforeAll( () => {
    wrapper = mount(FormsDaacs, { localVue, store})
    
  });


  it ('checks that the expected number of radio buttons are displayed', () => {
  
    const radio_buttons = wrapper.findAllComponents('.custom-radio')
    expect(radio_buttons).toHaveLength(12)
   
  })

  it ('checks that nothing is selected by default', () => {

    const selected = wrapper.findComponent('#selected_daac')
    expect(selected.exists()).toBeFalsy()
    
  })

  // // TODO - figure out why the vue doesn't update the infoSection properly
  // it ('checks that info is populated when radio button is selected', async () => {

  //   const infoSection = wrapper.getComponent('.info_section')
  //   const radioInput = wrapper.getComponent('[name="ORNL_DAAC"]')

  //   expect(infoSection.text()).toBeFalsy()
  //   expect(radioInput.element.checked).toBe(false)

  //   await radioInput.setChecked()
  //   await flushPromises()

  //   expect(radioInput.element.checked).toBe(true)
  //   expect(infoSection.text()).toBeTruthy()

  //   const description = wrapper.getComponent('#selected_description')
  //   expect(description.text()).toBe("NASA's Oak Ridge National Laboratory (ORNL) Distributed Active Archive Center (DAAC) is located at the Oak Ridge National Laboratory in Oak Ridge, Tennessee. ORNL DAAC was established in 1993 and is under an interagency agreement between NASA and the Department of Energy.\nORNL DAAC specializes on data and information relevant to terrestrial biogeochemistry, ecology, and environmental processes, which are critical to understanding the dynamics of Earth's biological, geological, and chemical components.")
    
  // })


})
