%% Metodo iterativo de la secante
% Variante del metodo de Newton-Raphson donde se toman 2 puntos iniciales y
% se evita calcular la derivada de f

function [tab, sol] = Secant(x0, x1, tol, n)
    format long
    syms x
    f(x) = sin(2*x) - (x/3)^3 + 0.1;

    err = 100;
    xn = NaN
    xn1 = x1;
    xn2 = x0;
    fn1 = eval(subs(f, xn1));
    fn2 = eval(subs(f, xn2));
    tab = table(0, xn2, fn2, err, 'VariableNames', {'i', 'xn', 'f(xn)', 'E'});

    err = abs(xn2 - xn1);
    tab(2,:) = {1, xn1, fn1, err};
    i = 2;
    while i < n && err > tol
        xn = xn1 - (fn1 * (xn1 - xn2)) / (fn1 - fn2);
        fn = eval(subs(f, xn));
        err = abs(xn - xn1);

        i = i + 1;
        tab(i,:) = {i-1, xn, fn, err};
        xn2 = xn1;
        xn1 = xn;
        fn1 = eval(subs(f, xn1));
        fn2 = eval(subs(f, xn2));
    end
    sol = xn;
end