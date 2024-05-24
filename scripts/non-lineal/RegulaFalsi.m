%% Metodo iterativo de la regla falsa
% Optimizacion de la ecuacion iterativa del metodo de la biseccion
% a: Punto inicial del intervalo
% b: Punto final del intervalo
% tol: Tolerancia al error
% n: Numero maximo de iteraciones
function [tab, sol] = RegulaFalsi(a, b, tol, n)
    format long
    syms x
    f(x) = x^2 - 5*x + 6*sin(x);

    i = 0;
    err = 100;
    fa = eval(subs(f, a));
    fb = eval(subs(f, b));

    if fa == 0
        tab = table(i, a, fa, 0, 'VariableNames', {'i', 'xr', 'f(xr)', 'E'});
        xr = a;
    elseif fb == 0
        tab = table(i, b, fb, 0, 'VariableNames', {'i', 'xr', 'f(xr)', 'E'});
        xr = b;
    elseif fb * fa > 0
        tab = table(NaN, NaN, NaN, NaN, 'VariableNames', {'i', 'xr', 'f(xr)', 'E'});
        xr = NaN;
    else
        xr = b - (fb*(a - b)) / (fa - fb);
        fx = eval(subs(f, xr));
        tab = table(i, xr, fx, err, 'VariableNames', {'i', 'xr', 'f(xr)', 'E'});
        while i < n && err > tol
            if fa * fx < 0 
                b = xr;
            else 
                a = xr;
            end
            fa = eval(subs(f, a));
            fb = eval(subs(f, b));

            old = xr;
            xr = b - (fb*(a - b)) / (fa - fb);
            fx = eval(subs(f, xr));
            err = abs(xr - old);
            i = i + 1;
            tab(i,:) = {i, xr, fx, err};
        end
        sol = xr;
        if fx == 0
            fprintf("Raiz de f(x): %f", sol)
        elseif err < tol
            fprintf("Raiz aproximada de f(x): %f", sol)
        else
            fprintf("Fracaso en %f iteraciones", i)
        end
    end
end
