%% Metodo iterativo de raices multiples
% Variante del metodo de Newton-Raphson para cuando la funcion tiene
% raices multiples

function [tab, sol] = MultipleRoots(x0, m, tol, n)
    format long
    syms x
    f(x) = x;
    df(x) = diff(f);

    i = 0;
    err = 100;
    xn = x0;
    fn = eval(subs(f, xn));
    dfn = eval(subs(df, xn));
    tab = table(i, xn, fn, dfn, err, 'VariableNames', {'i', 'xn', 'f(xn)', 'df(xn)', 'E'});
    while i < n && err > tol && dfn ~= 0
        old = xn;
        xn = xn - (m * fn) / dfn;
        fn = eval(subs(f, xn));
        dfn = eval(subs(df, xn));
        err = abs(xn - old);

        i = i + 1;
        tab(i+1,:) = {i, xn, fn, dfn, err};
    end
    sol = xn;
end