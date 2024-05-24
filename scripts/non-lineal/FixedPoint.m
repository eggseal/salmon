%% Metodo iterativo de punto fijo
% Hace algo
% sale de igualar f(x)=x
% x0: Punto inicial de la busqueda
% tol: Tolerancia al error
% n: Numero maximo de iteraciones
function [tab, sol] = FixedPoint(x0, tol, n)
    format long
    syms x

    f(x) = -7*log(x) + x - 13;
    g(x) = exp(-x/4);

    i = 1;
    xn = x0;
    fn = eval(subs(f, n));
    err = 100;
    tab = table(i-1, xn, fn, err, 'VariableNames', {'i', 'n', 'f(xn)', 'E'});
    
    while i < n && err > tol
        oldn = xn;
        xn = eval(subs(g, xn));
        fn = eval(subs(f, xn));
        err = abs(oldn - xn);
        i = i + 1;
        tab(i,:) = {i, xn, fn, err};
    end
    sol = xn;

