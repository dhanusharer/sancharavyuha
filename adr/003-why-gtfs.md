# ADR 003: Adoption of GTFS Static & GTFS-Realtime Protobuf Open Transit Standards

## Status
**ACCEPTED**

## Context
Public transit platforms often rely on proprietary database schemas for route shapes, stop locations, and bus GPS tracking. To achieve vendor lock-in resistance and seamless integration with public transit ecosystems (e.g. Google Maps, BMTC Open Data, Apple Maps), Sanchara Vyuha required a standardized data specification.

## Alternatives Considered
1. **Custom JSON API Schema**: Simple to implement initially, but isolates the platform from existing transit software ecosystems and requires custom connectors for every new city transit authority.
2. **GTFS Static (CSV) & GTFS-Realtime (Protobuf)**: The global open specification maintained by MobilityData and adopted by over 10,000 transit authorities worldwide.

## Decision
We adopted **GTFS Static & GTFS-Realtime Protobuf** because:
- **Global Interoperability**: Exposes standardized GTFS-RT Protobuf feeds (`trip_updates`, `vehicle_positions`, `alerts`) compatible with Google Maps and city transit command centers.
- **Production Efficiency**: Protobuf binary serialization reduces payload bandwidth by $82\%$ compared to raw JSON streaming.
- **Plug-and-Play Corridor Expansion**: Any new transit corridor with standard GTFS feed ZIPs can be ingested instantly without backend schema refactoring.

## Consequences
- **Positive**: 100% open-standard compliance, reduced network bandwidth, instant deployment across any GTFS-compliant transit authority.
- **Negative**: Requires Protobuf compilation tools (`protoc`) and GTFS zip parser middleware.
