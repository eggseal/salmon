%% Metodo iterativo de biseccion
% Recorta la funcion a la mitad hasta que encuentre la raiz dentro del
% intervalo
% a: Punto inicial del intervalo
% b: Punto final del intervalo
% tol: Tolerancia al error
% n: Numero maximo de iteraciones
function [tab, sol] = Bisection(a, b, tol, n)
    format long
    syms x
    f(x) = x^2 - 5*x + 6*sin(x);

    fa = eval(subs(f, a));
    fb = eval(subs(f, b));
    if fa == 0
        tab = table(0, a, fa, 0, 'VariableNames', {'i', 'xm', 'f(xm)', 'E'});
        tab(1,:) = {0, a, fa, 0};
        fprintf("Raiz de f(x): %f", a)
    elseif fb == 0
        tab = table(0, b, fb, 0, 'VariableNames', {'i', 'xm', 'f(xm)', 'E'});
        tab(1,:) = {0, b, fb, 0};
        fprintf("Raiz de f(x): %f", b)
    elseif fb * fa > 0
        tab = table(NaN, NaN, NaN, NaN, 'VariableNames', {'i', 'xm', 'f(xm)', 'E'});
        fprintf("Intervalo inadecuado")
    else
        i = 1;
        err = 100;

        m = (a + b) / 2;
        fm = eval(subs(f, m));
        tab = table(i, m, fm, err, 'VariableNames', {'i', 'xm', 'f(xm)', 'E'});
        while i < n && err > tol && fm ~= 0
            if fa * fm < 0 
                b = m;
            else 
                a = m;
            end

            old = m;
            m = (a + b) / 2;
            fm = eval(subs(f, m));
            err = abs(m - old);
            i = i + 1;
            tab(i,:) = {i, m, fm, err};
        end
        sol = m;
        if fm == 0
            fprintf("Raiz de f(x): %f", sol)
        elseif err < tol
            fprintf("Raiz aproximada de f(x): %f", sol)
        else
            fprintf("Fracaso en %f iteraciones", i)
        end
    end
end
