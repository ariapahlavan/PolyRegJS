// from a range -> to another range
export const mapper = (tmin, tmax) => (fmin, fmax) => (x) =>
    (((x-fmin)*(tmax-tmin))/(fmax-fmin)) + tmin;
