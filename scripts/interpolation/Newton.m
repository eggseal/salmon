%% Polinomio interpolante de Newton
% Dados n+1 puntos (x0, y0), ..., (xn, yn), el polinomio se escribe:

% p_n(x) = b0 + b1(x-x0) + b2(x-x1)(x-x0) + ... + bn(x-x0)(x-x1)...(x - xn-1)

% p0(x) = b0
% p1(x) = b0 + b1(x-x0)
% p2(x) = b0 + b1(x-x0) + b2(x-x1)(x-x0)
% ...
% pn(x) = b0 + b1(x-x0) + b2(x-x1)(x-x0) + ... + bn(x-x0)(x-x1)...(x - xn-1)

% Con esta ecuacion solo falta hallar bn

% bn = yn - pn-1(xn)/((xn-x0)(xn-x1)...(xn - xn-1))
