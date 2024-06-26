function [pol] = Lagrange(x,y)
    n=length(x);
    Tabla=zeros(n,n);
    for i=1:n
        Li=1;
        den=1;
        for j=1:n
            if j~=i
                paux=[1 -x(j)];
                Li=conv(Li,paux);
                den=den*(x(i)-x(j));
            end
        end
        Tabla(i,:)=y(i)*Li/den;
    end
    Tabla
    pol=sum(Tabla);

end