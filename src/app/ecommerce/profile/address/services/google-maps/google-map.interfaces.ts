export interface IGoogleMapConfiguration {
  url: string;
  icons: IGoogleMapMarkerIcons;
  styles: IGoogleMapStyles;
}

export interface IGoogleMapMarkerIcons {
  location: () => IGoogleMapMarkerIcon;
}

export interface IGoogleMapMarkerIcon {
  url: string;
  size?: google.maps.Size;
  scaledSize?: google.maps.Size;
  origin: google.maps.Point;
  anchor: google.maps.Point;
}

export interface IGoogleMapStyles {
  yellow: string;
  blue: string;
  green: string;
}

export interface IGoogleMapMarkerSettings {
  latitude: number;
  longitude: number;
}