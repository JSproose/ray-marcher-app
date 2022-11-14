const fragmentShader = `
#define MAX_STEPS 100
#define MAX_DIST 100.
#define SURF_DIST .01
#define MANDELBULB_POWER 8.



varying vec2 vUv;
uniform vec2 u_mouse;
uniform vec2 u_resolution;
uniform float u_time;
uniform int u_data_size;
uniform sampler2D u_matcap;
uniform bool u_mandelbulb;

struct Data {
	vec2 position;
	vec2 rotation;
  int shape;
};

// Add random size of array later
uniform Data u_data[10];


float sphereSDF(vec3 p, float r) {
  //Position and radius of sphere    
  float sphereDist =  length(p)-r;
  return sphereDist;
}


float sdBoxFrame( vec3 p, vec3 b, float e )
{
       p = abs(p  )-b;
  vec3 q = abs(p+e)-e;
  return min(min(
      length(max(vec3(p.x,q.y,q.z),0.0))+min(max(p.x,max(q.y,q.z)),0.0),
      length(max(vec3(q.x,p.y,q.z),0.0))+min(max(q.x,max(p.y,q.z)),0.0)),
      length(max(vec3(q.x,q.y,p.z),0.0))+min(max(q.x,max(q.y,p.z)),0.0));
}


float DE(vec3 z)
{
  int Iterations = 12;
  float Scale = 2.;
	vec3 a1 = vec3(1,1,1);
	vec3 a2 = vec3(-1,-1,1);
	vec3 a3 = vec3(1,-1,-1);
	vec3 a4 = vec3(-1,1,-1);
	vec3 c;
	int n = 0;
	float dist, d;
	while (n < Iterations) {
		 c = a1; dist = length(z-a1);
	        d = length(z-a2); if (d < dist) { c = a2; dist=d; }
		 d = length(z-a3); if (d < dist) { c = a3; dist=d; }
		 d = length(z-a4); if (d < dist) { c = a4; dist=d; }
		z = Scale*z-c*(Scale-1.0);
		n++;
	}

	return length(z) * pow(Scale, float(-n));
}


float sdCutHollowSphere( vec3 p, float r, float h, float t )
{
  // sampling independent computations (only depend on shape)
  float w = sqrt(r*r-h*h);
  
  // sampling dependant computations
  vec2 q = vec2( length(p.xz), p.y );
  return ((h*q.x<w*q.y) ? length(q-vec2(w,h)) : 
  abs(length(q)-r) ) - t;
}

float sdLink( vec3 p, float le, float r1, float r2 )
{
  vec3 q = vec3( p.x, max(abs(p.y)-le,0.0), p.z );
  return length(vec2(length(q.xy)-r1,q.z)) - r2;
}

float sdBox( vec3 p, vec3 b )
{
  vec3 q = abs(p) - b;
  return length(max(q,0.0)) + min(max(q.x,max(q.y,q.z)),0.0);
}

float sdRoundBox( vec3 p, vec3 b, float r )
{
  vec3 q = abs(p) - b;
  return length(max(q,0.0)) + min(max(q.x,max(q.y,q.z)),0.0) - r;
}

float DEM(vec3 pos) {
  int Iterations = 8;
  float Bailout = 1.15;
  float Power = 1. + (MANDELBULB_POWER-1.)*(0.5 - cos(u_time*radians(360.)/73.)*0.5);
	vec3 z = pos;
	float dr = 1.0;
	float r = 0.0;
	for (int i = 0; i < Iterations ; i++) {
		r = length(z);
		if (r>Bailout) break;
		
		// convert to polar coordinates
		float theta = acos(z.z/r);
		float phi = atan(z.y,z.x);
		dr =  pow( r, Power-1.0)*Power*dr + 1.0;
		
		// scale and rotate the point
		float zr = pow( r,Power);
		theta = theta*Power;
		phi = phi*Power;
		
		// convert back to cartesian coordinates
		z = zr*vec3(sin(theta)*cos(phi), sin(phi)*sin(theta), cos(theta));
		z+=pos;
	}
	return 0.5*log(r)*r/dr;
}


float smin( float a, float b, float k )
{
    float h = clamp( 0.5+0.5*(b-a)/k, 0.0, 1.0 );
    return mix( b, a, h ) - k*h*(1.0-h);
}

mat4 rotateY(float theta) {
  float c = cos(theta);
  float s = sin(theta);

  return mat4(
      vec4(c, 0, s, 0),
      vec4(0, 1, 0, 0),
      vec4(-s, 0, c, 0),
      vec4(0, 0, 0, 1)
  );
}

mat4 rotateX(float theta) {
  float c = cos(theta);
  float s = sin(theta);

  return mat4(
      vec4(1, 0, 0, 0),
      vec4(0, c, s, 0),
      vec4(0, -s, c, 0),
      vec4(0, 0, 0, 1)
  );
}

mat4 rotateZ(float theta) {
  float c = cos(theta);
  float s = sin(theta);

  return mat4(
      vec4(c, -s, 0, 0),
      vec4(s, c, 0, 0),
      vec4(0, 0, 1, 0),
      vec4(0, 0, 0, 1)
  );
}


vec3 rotate(vec3 p, vec3 rotation) {

  vec3 tp = (rotateY(rotation.y) * vec4(p, 1.0)).xyz;
  tp = (rotateX(rotation.x) * vec4(tp, 1.0)).xyz;
  tp = (rotateZ(rotation.z) * vec4(tp, 1.0)).xyz;

  return tp;
}

vec3 translate(vec3 p, vec3 translation) {
  vec3 tp = p - translation;

  return tp;
}

float randomShapeGenerator(vec3 p, int i) {
  // int rng = int(123.12 + vUv.y * 30.1789) / 10 * 10;
  

  float result;
  switch(u_data[i].shape) {
    case 0:
      result = sdBoxFrame(rotate(translate(p, vec3(u_data[i].position, 5.)), vec3(u_data[i].rotation, 0.)), vec3(0.5,0.5,1), .05);
      // result = sdBox(rotate(translate(p, vec3(u_data[i].position, 0.)), vec3(u_data[i].rotation, 0.)), vec3(0.7));
      break;
    case 1:
      result = sphereSDF(rotate(translate(p, vec3(u_data[i].position, 5.)), vec3(u_data[i].rotation, 0.)), 1.0);
      break;
    case 2:
      result = sdCutHollowSphere(rotate(translate(p, vec3(u_data[i].position, -5.)), vec3(u_data[i].rotation, 0.)), .5, .5, .5);
      break;
    case 3:
      result = sdLink(rotate(translate(p, vec3(u_data[i].position, 5.)), vec3(u_data[i].rotation, 0.)), 0.5, 0.5, 0.2);
      break;
    case 4:
      result = sdRoundBox(rotate(translate(p, vec3(u_data[i].position, 5.)), vec3(u_data[i].rotation, 0.)), vec3(0.25,0.25,0.5), 0.5);
      break;
  }

  return result;
}



float SDF(vec3 p) {
  float resultDist = 999.;

  float result2 = DEM(rotate(translate(p, vec3(0,1., 1.)), vec3(1,1,0)));
  for (int i = 0; i < u_data_size; i++) {
    float currDist = randomShapeGenerator(p, i);
    resultDist = smin(resultDist, currDist, 0.6);
  }


  if (u_mandelbulb) {
    return min(result2, resultDist);
  }

  return resultDist;

}

// https://iquilezles.org/articles/palettes/
vec3 GetColor(float amount) {
  vec3 col = 0.5 + 0.5 * cos(6.28319 * (vec3(1., 1., 1.) + amount * vec3(0., .33, 0.67)));
  return col * amount;
}


vec2 matcap(vec3 eye, vec3 normal) {
  vec3 reflected = reflect(eye, normal);
  float m = 2.8284271247461903 * sqrt( reflected.z + 20. );
  return reflected.xy / m + 0.5;
}

float RayMarch(vec3 ro, vec3 rd) {
    float dO=0.;
    
    for(int i=0; i<MAX_STEPS; i++) {
        vec3 p = ro + rd*dO;
        float dS = SDF(p);
        dO += dS;
        if(dO>MAX_DIST || dS < SURF_DIST) break;
    }
    
    return dO;
}

vec3 GetNormal(vec3 p) {
    float d = SDF(p);
    vec2 e = vec2(.01, 0);
    
    vec3 n = d - vec3(
        SDF(p-e.xyy),
        SDF(p-e.yxy),
        SDF(p-e.yyx));
    
    return normalize(n);
}

float GetLight(vec3 p) {
    vec3 lightPos = vec3(0, 5, 6);
    // lightPos.xz += vec2(sin(u_time), cos(u_time))*2.;
    vec3 l = normalize(lightPos-p);
    vec3 n = GetNormal(p);
    float dif = clamp(dot(n, l), 0., 1.);


    // Shadow Casting
    // float d = RayMarch(p+n*SURF_DIST*2., l);
    // if(d<length(lightPos-p)) dif *= .1;
    
    return dif;
}



void main()
{
    vec2 uv = vUv-0.5;    
    vec3 ro = vec3(0, 1, -5);
    vec3 rd = normalize(vec3(uv.x, uv.y, 1));

    float d = RayMarch(ro, rd);
    
    vec3 p = ro + rd * d;
    vec3 normal = GetNormal(p);
    float dif = dot(vec3(1,1,0), normal);
    vec2 matcapUV = matcap(p, normal);

    vec3 col = texture2D(u_matcap, matcapUV).rgb;
    // col = vec3(matcapUV, 0.1);
    gl_FragColor = vec4(col, 1.);
}

`

export default fragmentShader
