import { Module, VuexModule, Action, Mutation } from 'vuex-module-decorators'

function matchesYearFilter(minYear, maxYear, dataset) {
  const dMinYear = parseInt(dataset.timespan.period.gte)
  const dMaxYear = parseInt(dataset.timespan.period.lte)

  if (dMaxYear < minYear) {
    return false
  }
  return dMinYear <= maxYear
}

function matchesVariableFilter(selectedVariableClasses, dataset) {
  if (selectedVariableClasses.length === 0) {
    return true
  }
  for (const selectedVariableClass of selectedVariableClasses) {
    for (const variable of dataset.variables) {
      if (variable.class === selectedVariableClass) {
        return true
      }
    }
  }
  return false
}

function matchesQueryFilter(query, dataset) {
  const q = query.toLowerCase()
  return query.length > 0
    ? dataset.title.toLowerCase().includes(q) ||
        dataset.description.toLowerCase().includes(q)
    : true
}

// FIXME: create a clear schema with types for Datasets
const ALL_DATA = [
  {
    id: 'lbda',
    title: 'Living Blended Drought Atlas (LBDA) Version 2',
    description:
      'A recalibrated reconstruction of United States Summer PMDI over the last 2000 years. Updated half degree gridded Jun-Aug PMDI reconstructions from Cook et al. (2010). LBDA data in netCDF format are available from the [NOAA study page](https://www.ncdc.noaa.gov/paleo-search/study/22454).',
    type: 'dataset',
    status: 'Published',
    revised: '2017-08-03',
    region: {
      zoom: 2,
      center: [36.5, -95.75],
      resolution: '.5 degree (~55.5km)',
      name: 'Continental USA',
      style: { color: 'blue', weight: 2 },
      extents: [
        [49, -124.5],
        [24, -67],
      ],
    },
    timespan: {
      resolution: 'year',
      resolutionLabel: 'annually',
      period: {
        timeZero: 0,
        gte: '0001',
        lte: '2017',
        suffix: 'CE',
      },
    },
    uncertainty: 'No uncertainty estimates available.',
    methodSummary:
      'The half degree gridded Jun-Aug PMDI reconstructions from Cook et al. (2010) were recalibrated using the Global Historical Climatology Network (GHCN) 5km grid PMDI data. The 5km data were first upscaled to match the original half-degree grid. The recalibration was performed using a kernel density distribution mapping (KDDM) technique outlined in McGinnis et al. (2015) using an R-package provided by Seth McGinnis. The 50-year recalibration period used was 1929–1978 CE. The author’s also adjusted each grid point’s mean PMDI value for the recalibration period to be zero to avoid importing wet or dry bias into the recalibration. The recalibrated data set covers the continental United States just as the GHCN instrumental data does. Since instrumental data was used for 1979–2005 CE in the Cook dataset, recalibration applied only to the years 0–1978 CE. The 1979–2017 instrumental years were filled in using data from NCEI’s GHCN 5km instrumental PMDI data.',
    references:
      'Cook, E.R., Seager, R., Heim, R.R., Vose, R.S., Herweijer, C., and Woodhouse, C. 2010. Megadroughts in North America: Placing IPCC projections of hydroclimatic change in a long-term paleoclimate context. Journal of Quaternary Science, 25(1), 48-61. [doi: 10.1002/jqs.1303](https://doi.org/10.1002/jqs.1303)',
    originator: 'Gille, E.P.; Wahl, E.R.; Vose, R.S.; Cook, E.R.',
    contactInformation:
      '> DOC/NOAA/NESDIS/NCEI\n> National Centers for Environmental Information, NESDIS, NOAA, U.S. Department of Commerce\n> 325 Broadway, E/NE31\n> Boulder, CO 80305-3328\n> USA\n\n> https://www.ncdc.noaa.gov/data-access/paleoclimatology-data\n> email: paleo@noaa.gov\n> phone: 303-497-6280\n> fax: 303-497-6513',
    variables: [
      {
        id: 'lbda_precitation',
        class: 'Precipitation',
        name: 'Palmer Modified Drought Index',
        wmsLayer: 'SKOPE:pmdi_${year}-01-01',
        min: -6.0,
        max: 6.0,
        visible: false,
        styles: 'default',
        timeseriesServiceUri: 'lbda-v2/palmer_modified_drought_index',
        description:
          'Palmer’s Modified Drought Index: Jun–Aug.; <=-4.00 extreme drought; -3.00 to-3.99 severe drought; -2.00 to -2.99 moderate dought, -1.99 to 1.99 midrange; 2.00 to 2.99 moderately moist; 3.00 to 3.99 very moist; >=4.00 extremely moist.',
      },
    ],
    sourceUrl: 'https://www.ncdc.noaa.gov/paleo-search/study/22454',
  },
  {
    id: 'srtm',
    title: 'SRTM 90m Digital Elevation Model V4.1',
    originator: 'NASA Shuttle Radar Topographic Mission (SRTM)',
    references:
      'Jarvis A., H.I. Reuter, A. Nelson, E. Guevara, 2008, Hole-filled seamless SRTM data Version 4, available from the CGIAR-CSI SRTM 90m Database: http://srtm.csi.cgiar.org/.\n\nReuter H.I, A. Nelson, A. Jarvis, 2007, An evaluation of void filling interpolation methods for SRTM data, International Journal of Geographic Information Science, 21:9, 983-1008.',
    contactInformation:
      'For technical correspondence regarding the SRTM 90m Digital Elevation Data, contact:\n\n> Andy Jarvis, Ph.D.\n> Program Leader --- Decision and Policy Analysis\n> International Centre for Tropical Agriculture (CIAT)\n> Email: a.jarvis@cgiar.org',
    description:
      'Digital elevation data at 3 arc second (approx. 90m) horizontal resolution and less than 16m vertical resolution. The data are provided by the NASA Shuttle Radar Topographic Mission (SRTM) and the International Centre for Tropical Agriculture (CIAT), and are currently distributed free of charge by USGS and available for download through CGIAR at http://srtm.csi.cgiar.org/.',
    methodSummary:
      'These data are provided by the Consortium for Spatial Information (CGIAR-CSI) of the Consultative Group for International Agricultural Research (CGIAR). The data are post-processed 3-arc second DEM data for the globe. The original SRTM (v1) data has been subjected to a number of processing steps to provide seamless and complete elevational surfaces for the globe. In its original release, SRTM data contained regions of no-data, specifically over water bodies (lakes and rivers), and in areas where insufficient textural detail was available in the original radar images to produce three-dimensional elevational data. The CGIAR-CSI SRTM data product applies a hole-filling algorithm to provide continuous elevational surfaces.',
    uncertainty: '< 16m vertical error',
    sourceUrl: 'http://srtm.csi.cgiar.org',
    type: 'dataset',
    status: 'Published',
    revised: '2009-06-14',
    region: {
      zoom: 2,
      center: [37.5, -95],
      resolution: '250m',
      name: 'Continental USA',
      style: { color: 'gray', weight: 2 },
      extents: [
        [50, -125],
        [25, -65],
      ],
    },
    timespan: {
      resolution: '',
      resolutionLabel: '',
      period: {
        gte: '2009',
        lte: '2009',
        suffix: 'CE',
      },
    },
    variables: [
      {
        id: 'srtm_elevation',
        class: 'Elevation',
        name: 'Elevation (m)',
        wmsLayer: 'SKOPE:srtm',
        visible: false,
        min: 0.0,
        max: 4500.0,
        styles: 'default',
      },
    ],
  },
  {
    id: 'paleocar',
    title: 'PaleoCAR: SW USA Paleoclimatic Reconstruction',
    originator: 'Bocinsky, R.K.; Kohler, T.A.',
    references:
      'Bocinsky, R. Kyle, and Timothy A. Kohler. 2014. A 2,000-year reconstruction of the rain-fed maize agricultural niche in the US Southwest. Nature Communications 5:5618. [doi: 10.1038/ncomms6618](https://doi.org/10.1038/ncomms6618).',
    contactInformation:
      '> DOC/NOAA/NESDIS/NCEI\n> National Centers for Environmental Information, NESDIS, NOAA, U.S. Department of Commerce\n> 325 Broadway, E/NE31\n> Boulder, CO 80305-3328\n> USA\n> https://www.ncdc.noaa.gov/data-access/paleoclimatology-data\n> email: paleo@noaa.gov\n> phone: 303-497-6280\n> fax: 303-497-6513',
    uncertainty:
      "The uncertainty for GDD and Precipitation that is available on the graph and in the graph data download csv represents the predicted residual error sum of squares (PRESS) statistic for each cell's reconstruction. [add uncertainty for maize farming niche]",
    methodSummary:
      'For each pixel, for each year, the model selects the tree ring chronologies (within a 10-degree buffer of the Four Corners states; from the National Tree Ring Database) that best predict PRISM data for that location and uses linear regression to estimate the paleoenvironmental variable for that date and location.\n\nBecause the Maize Farming Niche is based on direct precipitation, maize farming may be possible if other water sources are utilized (e.g. spring or rivers) or if precipitation is concentrated on fields through water diversion structures (e.g. ak chin fields) or geologically (e.g. sand dune fields).',
    description:
      'High spatial resolution (30 arc-second, ~800 m) Southwestern United States tree-ring reconstructions of ' +
      ' May-Sept growing degree days (GDD), net water-year precipitation (previous Oct–Sept), and the direct precipitation maize ' +
      ' farming niche (>= 1800 growing Season F GDD & >= 300 mm water-year precipitation).',
    sourceUrl: 'https://www.ncdc.noaa.gov/paleo/study/19783',
    type: 'dataset',
    status: 'Published',
    revised: '2016-04-01',

    region: {
      zoom: 4,
      center: [37, -108.5],
      resolution: '800m',
      name: 'Southwestern USA',
      style: { color: 'red', weight: 1 },
      extents: [
        [43, -115],
        [31, -102],
      ],
    },
    timespan: {
      resolution: 'year',
      resolutionLabel: 'annually',
      period: {
        timeZero: 1,
        gte: '0001',
        lte: '2000',
        suffix: 'CE',
      },
    },
    variables: [
      {
        id: 'paleocar_temperature',
        class: 'Temperature',
        name: 'Growing Degree Days (F, May-Sept)',
        timeseriesServiceUri: 'paleocar_2/growing_degree_days',
        wmsLayer: 'SKOPE:paleocar_gdd_${year}-01-01',
        min: 0.0,
        max: 10.0,
        visible: false,
        styles: 'default,raster',
        description: 'F deg.; Growing Season: May–Sept.',
      },
      {
        id: 'paleocar_precipitation',
        class: 'Precipitation',
        name: 'Water-year (Oct-Sept) Precipitation (mm)',
        timeseriesServiceUri: 'paleocar_2/water_year_precipitation',
        wmsLayer: 'SKOPE:paleocar_ppt_${year}-01-01',
        min: 0.0,
        max: 10.0,
        visible: false,
        styles: 'default,raster',
        description: '(prev. Oct through listed year Sept)',
      },
      {
        id: 'paleocar_crop_niche',
        class: 'Crop Niche',
        name: 'Maize Farming Niche (Direct Precip.)',
        timeseriesServiceUri: 'paleocar_2/maize_farming_niche',
        wmsLayer: 'SKOPE:niche_${year}',
        min: 0.0,
        max: 1.0,
        visible: false,
        styles: 'default',
        description:
          'In niche if Growing Season F GDD (as above) >= 1800 & Water Year Precip. (as above) >= 300 mm; otherwise out of niche.',
      },
    ],
  },
]

@Module({ stateFactory: true, name: 'datasets', namespaced: true })
class DataSets extends VuexModule {
  loading = false
  all = []
  selectedDataset = {}
  filterCriteria = {
    selectedVariableClasses: [],
    yearStart: 1,
    yearEnd: 2019,
    query: '',
  }
  get selectedDatasetTimeZero() {
    const dataset = this.selectedDataset
    if (dataset.id) {
      return dataset.timespan.period.timeZero || 0
    }
    return 0
  }
  get selectedDatasetTimespan() {
    const dataset = this.selectedDataset
    if (dataset.id) {
      return [dataset.timespan.period.gte, dataset.timespan.period.lte]
    }
    console.log('No selected dataset, returning default year range')
    return [1, new Date().getFullYear()]
  }
  get filteredDatasets() {
    return this.all.filter((dataset) => {
      const selectedVariableClasses = this.filterCriteria
        .selectedVariableClasses
      const minYear = this.filterCriteria.yearStart
      const maxYear = this.filterCriteria.yearEnd
      const query = this.filterCriteria.query || ''

      return (
        matchesYearFilter(minYear, maxYear, dataset) &&
        matchesQueryFilter(query, dataset) &&
        matchesVariableFilter(selectedVariableClasses, dataset)
      )
    })
  }

  @Action({ commit: 'load' })
  retrieveData() {
    if (this.loading) {
      console.debug('already loading - ignoring request')
    }
    return ALL_DATA
  }

  @Action({ commit: 'applyFilterCriteria' })
  filter(filterCriteria) {
    return filterCriteria
  }

  @Action
  loadDataset(id) {
    if (this.selectedDataset.id !== id) {
      if (this.all === undefined || this.all.length === 0) {
        this.load(ALL_DATA)
      }
      this.selectDataset(id)
    }
  }

  @Action
  loadAndSelectVariable(id) {
    if (this.all === undefined || this.all.length === 0) {
      this.load(ALL_DATA)
    }
    if (state.selectedDataset) {
      this.selectVariable(id)
    }
  }

  @Mutation
  load(data) {
    this.loading = true
    // FIXME: eventually this should get loaded from the backend from an async call
    this.all = data
    this.loading = false
  }

  @Mutation
  selectDataset(id) {
    this.selectedDataset = this.all.find((dataset) => dataset.id === id)
  }

  @Mutation
  selectVariable(id) {
    let selectedVariable = this.selectedDataset.variables.find(
      (variable) => variable.id === id
    )
    selectedVariable.visible = true
    this.selectedDataset.selectedVariable = selectedVariable
  }

  @Mutation
  applyFilterCriteria(filterCriteria) {
    this.filterCriteria = filterCriteria
  }
}

export { DataSets }
