<template>
  <v-row pa-2 mb-2 align-content-start justify-space-around fill-height>
    <v-col xs4>
      <div class="map px-2">
        <client-only>
          <l-map
            :min-zoom="2"
            :max-zoom="8"
            :zoom="region.zoom"
            :center="region.center"
          >
            <l-control-scale />
            <l-tile-layer
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}"
              attribution="Tiles &copy; Esri"
            />
            <l-rectangle :bounds="region.extents" :l-style="region.style" />
          </l-map>
        </client-only>
      </div>
    </v-col>
    <v-col xs8>
      <div class="px-2">
        <v-card>
          <v-card-title class="pb-0">
            <h2 class="headline">
              <nuxt-link :to="absoluteUrl" class="blue--text">
                {{ title }}
              </nuxt-link>
            </h2>
          </v-card-title>
          <v-subheader class="subheading">
            {{ spatialCoverage }} | {{ temporalCoverage }}
          </v-subheader>
          <v-card-text class="body">
            <div v-html="$md.render(description)"></div>
          </v-card-text>
          <!-- FIXME: extract this to a component and reuse across the detail page -->
          <v-list dense light>
            <v-list-item v-for="(variable, index) in variables" :key="index">
              <v-list-item-content>
                <v-list-item-title class="variable">
                  <v-chip
                    small
                    label
                    class="ma-2"
                    color="indigo"
                    text-color="white"
                  >
                    <v-icon>view_column</v-icon>
                    {{ variable.class }}
                  </v-chip>
                  {{ variable.name }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
          <v-card-text>
            <div class="py-3 citation font-weight-bold">
              <em> Source: </em>
              <a target="_blank" :href="sourceUrl">
                {{ sourceUrl }}
                <v-icon color="teal" x-small>fas fa-external-link-alt</v-icon>
              </a>
            </div>
          </v-card-text>
        </v-card>
      </div>
    </v-col>
  </v-row>
</template>

<script>
import Vue from 'vue'
import { Component } from 'nuxt-property-decorator'
import { Prop } from 'vue-property-decorator'
import { BaseMapProvider } from '@/store/modules/constants'

@Component()
class Dataset extends Vue {
  @Prop()
  title //: String

  @Prop()
  status //: String

  @Prop()
  revised //: String

  @Prop()
  region //: Object

  @Prop()
  timespan //: Object

  @Prop()
  description //: String

  @Prop()
  variables //: Array

  @Prop()
  id //: String

  @Prop()
  sourceUrl //: String

  // --------- GETTERS ---------

  get defaultBaseMap() {
    return BaseMapProvider.default
  }
  get spatialCoverage() {
    return `${this.region.name} at ${this.region.resolution}`
  }
  get temporalCoverage() {
    const period = this.timespan.period
    const timespan =
      period.gte === period.lte ? period.gte : `${period.gte}-${period.lte}`
    return `${timespan}${period.suffix} ${this.timespan.resolutionLabel}`
  }
  get absoluteUrl() {
    return '/dataset/' + this.id
  }
  get defaultCrs() {
    if (this.$L) {
      return this.$L.CRS.EPSG4326
    }
    return ''
  }

  // --------- METHODS ---------

  initMap() {}

  initLayers() {}
}
export default Dataset
</script>
<style scoped>
.map {
  height: 100%;
  position: relative;
  z-index: 1;
}
.variable {
  height: 3em;
}
</style>
