# ICD-10 GM Helper
A Node.js package for quickly finding the ICD-10 code of a diagnosis.  

## About this project
The ICD-10 GM is the German modification of the 10th revision of the international statistical classification of diseases and related health problems. This Node.js helper program was written for a german web app for managing patients, where it is important to find the ICD-10 code for a diagnosis.

## Usage
Import the package, then you can call the `getICDCodeByDiagnosisName(diagnosisName)` method, which takes a diagnosis (or partial diagnosis) name as the parameter and returns possible matches as an object (with the keys name and ICDCode).

### Available features
Currently, the only available feature is getting the ICD code by providing a diagnosis name. The classification codes contain subclasses (e.g. E10.01 is a subclass of E10). For the purpose of our current app, only the main classes are needed with codes that contain three characters (e.g. E10 for Diabetes mellitus or I10 for Essentielle (primäre) Hypertonie). Further features may be added as needed.

## Copyright
The CSV data used in this module was taken from the [Download center](https://www.bfarm.de/DE/Kodiersysteme/Services/Downloads/_node.html) of Germany's Federal Institute for Drugs and Medical Devices. The codes and other data included in the downloaded data were not altered in any way, and this package is intended for non-commercial use.