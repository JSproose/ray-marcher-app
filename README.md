# Realtime Ray Marching Web App: https://jasper-calder.github.io/Ray-Marching-App/

A web application powered by WebGL and React that allows users to generate and download mesmorizing artwork for their desktop background using a realtime ray marching engine.

## What is ray marching?

<b>Ray marching</b> is a category of real time graphics rendering methods. The method illustrated in the figure below and used in the web app is a subtype called <b>sphere tracing</b>. Sphere tracing casts a ray from the camera, then iteratively calculates the distance from the current position along the ray to all implicit surfaces until that distance is below a certain threshold or a maximum number of iterations has been exceeded. Once this occurs, the measured ray is used to define the normal to the surface, which can be used to calculate lighting conditions and colour. Multiple objects may lie on the path of a ray, so the ray marching function takes the minimum of the distances to the two objects (calculated by <b>signed distance functions</b>) to display the one in front. However, the two surfaces can and are blended together in my application by taking a smooth minimum between the two distances.

<p align="center">
  <img src="https://adrianb.io/img/2016-10-01-raymarching/figure3.png" />
</p>

## Features

### Matcaps
The user can choose from a range of materials to assign the objects in the scene, from a psychedelic mix of blues and purples to a shimmering gold. 

![matcapsGif](https://user-images.githubusercontent.com/81532989/201606638-5f9acf34-c123-416c-9652-4664430edba7.gif)

### Mandelbulb
The user can toggle the visibility of an <b>animated mandelbulb</b>, a 3D representation of a mandelbrot set created for the first time by Jules Ruis in 1997.

![mandelbulb-gif5](https://user-images.githubusercontent.com/81532989/201610509-116bcb78-e317-4b11-bfa9-4234805f27fc.gif)

### Pausing
The user can pause the mandelbulb animation on their desired frame with the </b>pause/play button</b>.

![pause-gif](https://user-images.githubusercontent.com/81532989/201613940-b4b515c5-0d40-4541-9717-f5513fac18c6.gif)


### Shuffle
The user can randomize the position of the background objects by clicking the <b>shuffle button</b>.

![shuffle-gif](https://user-images.githubusercontent.com/81532989/201614167-019d2ba3-1afc-4fa5-b043-961696d0b033.gif)


### Save
The user can save the entire canvas as a JPEG by clicking the <b>save button</b>.

![save-gif](https://user-images.githubusercontent.com/81532989/201613351-89550c24-ac3e-4532-9a6d-7890b190c5db.gif)

## Credits

* Signed distance functions sourced from Inigo Quilez's website: https://iquilezles.org/articles/raymarchingdf/ 
* Mandelbulb distance estimator function sourced from: https://www.shadertoy.com/view/wdjGWR
* Inspired by Coding Adventure: Ray Marching by Sebastian Lague: https://www.youtube.com/watch?v=Cp5WWtMoeKg



