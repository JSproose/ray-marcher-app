# Realtime Raymarching Web App

A web application powered by WebGL and React that allows users to generate and download mesmorizing artwork for their desktop background using a realtime raymarching engine.

## What is ray marching?

Ray marching is a category of real time graphics rendering methods. The method displayed by the below figure and used in this web application is a type of ray marching called <b>sphere tracing</b>. Sphere tracing casts a ray from the camera, then iteratively calculates the distance from the current position along the ray to all implicit surfaces until that distance is below a certain threshold or a maximum number of iterations has been exceeded. Once this occurs, the measured ray is used to define the normal to the surface, which can be used to calculate lighting conditions and colour. Multiple objects may lie on the path of a ray, so the ray marching function takes the minimum of the distances to the two objects (calculated by <b>signed distance functions</b>) to display the one in front. However, the two surfaces can and are blended together in my application by taking a smooth minimum between the two distances.  

![image](https://user-images.githubusercontent.com/81532989/201599763-9d0236ca-1653-4eb1-ab59-80971a5b6096.png)

## Features

### Matcaps
The user can choose from a range of materials to assign the objects in the scene, from a psychedelic mix of blues and purples to a shimmering gold. 

![matcapsGif](https://user-images.githubusercontent.com/81532989/201606638-5f9acf34-c123-416c-9652-4664430edba7.gif)

### Mandelbulb
The user can toggle the visibility of an animated mandelbulb, a 3D representation of a mandelbrot set created for the first time by Jules Ruis in 1997.

![mandelbulb-gif5](https://user-images.githubusercontent.com/81532989/201610509-116bcb78-e317-4b11-bfa9-4234805f27fc.gif)



### Pausing

### Shuffle


### Matcaps
The user can choose from a range of materials 

## Credits


