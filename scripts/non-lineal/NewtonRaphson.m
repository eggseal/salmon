%% Metodo iterativo de Newton-Raphson

function [tab, sol] = NewtonRaphson(x0, tol, n)
    format long
    syms x
    f(x) = sin(2*x) - (x/3)^3 + 0.1;
    df(x) = diff(f);

    i = 1;
    xn = x0;
    err = 100;
    fn = eval(subs(f, xn));
    dfn = eval(subs(df, xn));
    tab = table(i+1, xn, fn, dfn, err, 'VariableNames', {'i', 'xn', 'f(xn)', 'df(xn)', 'E'});
    while i < n && err > tol && dfn ~= 0
        old = xn;
        xn = old - fn / dfn;

        fn = eval(subs(f,xn));
        dfn = eval(subs(df, xn));
        err = abs(xn - old);
        i = i + 1;
        tab(i,:) = {i, xn, fn, dfn, err};
    end
    sol = xn;
    if fn == 0
        fprintf("Raiz de f(x): %f", sol);
    elseif err < tol
        fprintf("Raiz aproximada de f(x): %f", sol);
    elseif dfn == 0
        fprintf("Raiz posible de f(x): %f", sol);
    else 
        fprintf("Fracaso en %f iteraciones", i);
    end
end
