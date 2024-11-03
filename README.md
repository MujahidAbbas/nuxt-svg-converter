# Nuxt.js SVG Converter

## Project Overview
The SVG Converter is a Nuxt.js application designed to facilitate seamless SVG file handling and conversion. Users can upload, preview, and export SVG files in various formats, including React and React Native components, PNG images, and Base64 Data URIs. This tool aims to enhance workflow efficiency by providing real-time updates and multiple export options.

## Installation
### Prerequisites
Ensure that you have Node.js and npm/yarn installed on your system.

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/MujahidAbbas/nuxt-svg-converter.git
   ```
2. Navigate to the project directory:
   ```bash
   cd nuxtjs-svg-converter
   ```
3. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```
4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```
5. Access the application at `http://localhost:3000`.

## Usage
To use the SVG Converter:
1. **Upload**: Click the *Upload* button and select an SVG file from your device.
2. **Tabs**:
   - **Preview**: View the original SVG file.
   - **React**: Copy React component code with props spreading for easy integration.
   - **React Native**: Copy code converted for react-native-svg components.
   - **PNG**: See a live preview of the SVG rendered as PNG and download it.
   - **Data URI**: Copy Base64-encoded SVG for embedding in `img` tags.
3. All previews update in real-time as you make changes to the SVG code.

## Features
- **Tabbed Interface**: Multiple export options (Preview, React, React Native, PNG, Data URI).
- **File Validation**: Ensures only valid SVGs are uploaded.
- **Responsive Design**: User-friendly interface with clear feedback mechanisms.
- **Real-time Updates**: Automatic updates of previews and exports when SVG content changes.
- **PNG Generation**: Live PNG preview with download capability.
- **Error Handling**: Robust handling of invalid SVGs to ensure reliability.

## Contributing
Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create a feature branch (`git checkout -b feature-name`).
3. Commit your changes (`git commit -m 'Add a feature'`).
4. Push to the branch (`git push origin feature-name`).
5. Open a pull request for review.

## License
This project is licensed under the MIT License. You are free to use, modify, and distribute this software as per the license terms.

## Screenshots/Demos
- Screenshot showing the tabbed interface with export options.
- Demo link for a live preview (e.g., hosted on Vercel/Netlify).

## Checklist
- [ ] Clone and set up the repository.
- [ ] Install all required dependencies.
- [ ] Run the development server and access the app.
- [ ] Test all export options (Preview, React, React Native, PNG, Data URI).
- [ ] Verify real-time SVG updates.
- [ ] Check error handling with invalid SVG uploads.
- [ ] Ensure responsive design and usability.
- [ ] Submit feedback or contribute improvements.

Feel free to modify this `Readme.md` as per your project's requirements!

