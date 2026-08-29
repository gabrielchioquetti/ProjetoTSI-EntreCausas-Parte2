package br.com.entrecausas.Controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;


@Controller
public class ImpactoController {
    
    @GetMapping("/impacto")
    public String paginaImpacto() {
        return "impacto";
    }
    
}
