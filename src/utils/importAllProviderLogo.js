
export async function importAllProviderLogo() {
    const images = {};
    const imageFiles = import.meta.glob('/src/assets/img/providers/*.{png,jpg,jpeg,svg}');
  
    console.log(imageFiles);
    for (const path in imageFiles) {
        const key = path.slice(path.lastIndexOf('/') + 1, path.lastIndexOf('.'));
        // const file = (await imageFiles[path]()).default
        images[key] = (await imageFiles[path]()).default;
    }
    return images;
  }